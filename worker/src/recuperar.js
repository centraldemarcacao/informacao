/**
 * Busca por trechos HÍBRIDA: palavras-chave + significado (embeddings).
 *
 * - Palavras-chave: rápida e exata (nomes, siglas, telefones). Sempre disponível.
 * - Significado: entende sinônimos e frases diferentes ("quanto custa" = "valor da consulta").
 *   Usa o modelo multilíngue @cf/baai/bge-m3 do Workers AI (grátis, sem chave) e guarda os vetores
 *   no KV ("VETORES"). Se faltar o AI ou o KV, ou se algo falhar, a busca segue só com palavras-chave.
 * - As duas listas são combinadas por "fusão de ranking" (RRF) e os trechos escolhidos entram no prompt.
 * - Se nada combinar, devolve null e o chamador usa a base completa.
 */
import { SECOES } from './base.js';

const ORCAMENTO = 16000;        // máx. de caracteres de trechos por pergunta (≈ 5 mil tokens)
const SECAO_INTEIRA_ATE = 8000; // seção pequena com assunto citado na pergunta entra inteira
const MAX_POR_SECAO = 8000;     // teto de trechos soltos de uma mesma seção

const MODELO_EMB = '@cf/baai/bge-m3';
const LOTE = 24;                // textos por chamada ao gerar os vetores
const SIM_MINIMA = 0.42;        // similaridade mínima (cosseno) para um trecho contar como "parecido"
const TOP_SEMANTICO = 40;
const RRF_K = 12;
const PRAZO_MS = 1800;          // tempo máximo gasto com a busca por significado antes de seguir só com palavras-chave

const STOP = new Set(('a o as os um uma uns umas de do da dos das em no na nos nas por para com sem sob sobre e ou mas que qual quais quem quanto quanta ' +
  'como onde quando se ao aos ha tem ter tenho temos fazer faz fazem eh sao foi ser esta estao esse essa esses essas este esta isso isto aqui ali ' +
  'meu minha seu sua me te lhe nos favor pode podem poderia gostaria saber queria preciso precisa voce voces ola bom boa dia tarde noite oi obrigado obrigada ' +
  'tudo bem mais menos muito muita ja nao sim so tambem ainda quero existe existem informacao informacoes duvida sobre sobre').split(/\s+/));

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function tokens(s) {
  return norm(s).split(/[^a-z0-9]+/).filter((t) => t.length >= 3 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t));
}

/* ------------------------------ índice de palavras ------------------------------ */
let INDICE = null;
function indice() {
  if (INDICE) return INDICE;
  const unidades = [];
  SECOES.forEach((s, si) => {
    const meta = new Set(tokens(s.t + ' ' + (s.k || '')));
    (s.u || []).forEach(([cab, txt], ui) => {
      unidades.push({ id: unidades.length, si, ui, cab, txt, set: new Set(tokens(txt)), meta: new Set([...meta, ...tokens(cab)]) });
    });
  });
  const df = new Map();
  unidades.forEach((u) => u.set.forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
  const N = unidades.length || 1;
  const idf = (t) => Math.log(1 + N / (1 + (df.get(t) || 0)));
  const metaSecao = SECOES.map((s) => new Set(tokens(s.t + ' ' + (s.k || ''))));
  INDICE = { unidades, idf, metaSecao };
  return INDICE;
}

/** Palavras da pergunta atual (peso 1) e da anterior (peso 0,5), para entender "e à tarde?". */
function consulta(messages) {
  const users = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const q = new Map();
  const add = (txt, w) => tokens(txt || '').forEach((t) => q.set(t, Math.max(q.get(t) || 0, w)));
  add(users[users.length - 1], 1);
  add(users[users.length - 2], 0.5);
  return q;
}

/** Texto usado para a busca por significado: a pergunta atual (+ a anterior se a atual for curta, ex.: "SUS"). */
function textoDaConsulta(messages) {
  const users = messages.filter((m) => m.role === 'user').map((m) => m.content.trim());
  const ultima = users[users.length - 1] || '';
  const anterior = users[users.length - 2] || '';
  return (ultima.length < 30 && anterior ? anterior + ' ' + ultima : ultima).slice(0, 600);
}

function pontuar(u, q, idf) {
  let p = 0;
  for (const [t, w] of q) {
    if (u.set.has(t)) p += w * idf(t);
    else if (u.meta.has(t)) p += w * 0.5;
    else if (t.length >= 5) {                       // prefixo comum: "radio" ~ "radioterapia"
      for (const x of u.set) if (x.length >= 5 && t.slice(0, 5) === x.slice(0, 5)) { p += w * idf(x) * 0.6; break; }
    }
  }
  return p;
}

/* ------------------------------ vetores (significado) ------------------------------ */
let VETORES = null;          // { dim, dados: Int8Array(n*dim) } — em memória (por instância do Worker)
let CONSTRUINDO = null;      // Promise da construção em andamento
let FALHOU_EM = 0;           // evita insistir logo após uma falha

function hashBase() {        // muda quando a base muda → vetores antigos deixam de valer
  let h = 2166136261;
  for (const s of SECOES) for (const [, t] of s.u || []) for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16);
}
const CHAVE_KV = () => `vet:${MODELO_EMB}:${hashBase()}:${indice().unidades.length}`;

/** Texto de cada trecho para gerar o vetor (inclui o assunto da seção para dar contexto). */
const textoDoTrecho = (u) => `${SECOES[u.si].t.replace(/\s*\(.*?\.html\)/, '')}. ${u.cab ? u.cab.replace(/^#+\s*/, '') + '. ' : ''}${u.txt}`.slice(0, 1400);

function extrairMatriz(r) {
  const m = r && (r.data || r.embeddings || r.response);
  return Array.isArray(m) && Array.isArray(m[0]) ? m : null;
}
function normalizarParaInt8(v) {
  let n = 0; for (let i = 0; i < v.length; i++) n += v[i] * v[i];
  n = Math.sqrt(n) || 1;
  const out = new Int8Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = Math.max(-127, Math.min(127, Math.round((v[i] / n) * 127)));
  return out;
}
const paraBase64 = (i8) => { let s = ''; const b = new Uint8Array(i8.buffer, i8.byteOffset, i8.byteLength); for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); return btoa(s); };
const deBase64 = (str) => { const s = atob(str), b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return new Int8Array(b.buffer); };

async function gerarVetores(env) {
  const { unidades } = indice();
  const textos = unidades.map(textoDoTrecho);
  const lotes = []; for (let i = 0; i < textos.length; i += LOTE) lotes.push(textos.slice(i, i + LOTE));
  const partes = new Array(lotes.length);
  let proximo = 0, dim = 0;
  const trabalhador = async () => {
    while (proximo < lotes.length) {
      const k = proximo++;
      const mat = extrairMatriz(await env.AI.run(MODELO_EMB, { text: lotes[k] }));
      if (!mat || mat.length !== lotes[k].length) throw new Error('resposta inesperada do modelo de vetores');
      dim = mat[0].length; partes[k] = mat.map(normalizarParaInt8);
    }
  };
  await Promise.all([trabalhador(), trabalhador(), trabalhador()]);
  const dados = new Int8Array(unidades.length * dim); let pos = 0;
  for (const p of partes) for (const v of p) { dados.set(v, pos); pos += dim; }
  return { dim, dados };
}

/** Garante os vetores em memória: lê do KV; se não houver, gera em segundo plano (as perguntas seguem só com palavras-chave até ficar pronto). */
async function garantirVetores(env, ctx) {
  if (VETORES) return VETORES;
  if (!env.AI || env.BUSCA_SEMANTICA === 'off') return null;
  if (CONSTRUINDO || Date.now() - FALHOU_EM < 5 * 60_000) return null;
  const chave = CHAVE_KV();
  if (env.VETORES) {
    try {
      const salvo = await env.VETORES.get(chave, 'json');
      if (salvo && salvo.dim && salvo.b64) { VETORES = { dim: salvo.dim, dados: deBase64(salvo.b64) }; return VETORES; }
    } catch (e) { console.error('kv leitura', String(e).slice(0, 200)); }
  }
  const tarefa = (async () => {
    try {
      const v = await gerarVetores(env);
      VETORES = v;
      if (env.VETORES) await env.VETORES.put(chave, JSON.stringify({ dim: v.dim, b64: paraBase64(v.dados) }));
    } catch (e) { FALHOU_EM = Date.now(); console.error('vetores', String(e).slice(0, 300)); }
    finally { CONSTRUINDO = null; }
  })();
  CONSTRUINDO = tarefa;
  if (ctx && ctx.waitUntil) ctx.waitUntil(tarefa);
  return null;
}

const comPrazo = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('prazo')), ms))]);

/** Similaridade (cosseno) da pergunta com cada trecho. Devolve lista ordenada [{u, cos}] ou null. */
async function buscaSemantica(messages, env, ctx) {
  const v = await garantirVetores(env, ctx);
  if (!v) return null;
  const mat = extrairMatriz(await env.AI.run(MODELO_EMB, { text: [textoDaConsulta(messages)] }));
  if (!mat) return null;
  const q = normalizarParaInt8(mat[0]); const { unidades } = indice();
  if (q.length !== v.dim) return null;
  const out = [];
  for (let i = 0; i < unidades.length; i++) {
    let s = 0; const base = i * v.dim;
    for (let d = 0; d < v.dim; d++) s += q[d] * v.dados[base + d];
    out.push({ u: unidades[i], cos: s / (127 * 127) });
  }
  return out.sort((a, b) => b.cos - a.cos);
}

/* ------------------------------ seleção ------------------------------ */
function montar(messages, semantico) {
  const { unidades, idf, metaSecao } = indice();
  const q = consulta(messages);
  const sem = (semantico || []).slice(0, TOP_SEMANTICO).filter((x) => x.cos >= SIM_MINIMA);
  if (!q.size && !sem.length) return null;

  // pontuação por palavras-chave
  const kw = unidades.map((u) => ({ u, p: pontuar(u, q, idf) })).filter((x) => x.p > 0).sort((a, b) => b.p - a.p);
  // fusão de rankings (RRF): trechos bem colocados em qualquer lista sobem
  const fusao = new Map();
  kw.forEach((x, i) => fusao.set(x.u.id, (fusao.get(x.u.id) || 0) + 1 / (RRF_K + i)));
  sem.forEach((x, i) => fusao.set(x.u.id, (fusao.get(x.u.id) || 0) + 1 / (RRF_K + i)));
  const candidatos = [...fusao.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => unidades[id]);

  const escolhidas = new Set(); const secaoCompleta = new Set();
  let usado = SECOES.filter((s) => s.f).reduce((a, s) => a + s.c.length, 0);
  const custo = (u) => u.txt.length + 8;

  // 1) seções pequenas cujo assunto aparece na pergunta (palavras) ou concentram os trechos parecidos (significado) entram inteiras
  const votos = new Map(); sem.slice(0, 8).forEach((x) => votos.set(x.u.si, (votos.get(x.u.si) || 0) + 1));
  const secs = SECOES.map((s, si) => {
    let m = 0; for (const [t, w] of q) if (metaSecao[si].has(t)) m += w;
    if ((votos.get(si) || 0) >= 3) m += 0.5 * votos.get(si);
    const tam = (s.u || []).reduce((a, [, t]) => a + t.length + 8, 0);
    return { si, m, tam };
  }).filter((x) => !SECOES[x.si].f && x.m > 0 && x.tam <= SECAO_INTEIRA_ATE).sort((a, b) => b.m - a.m);
  for (const x of secs) {
    if (usado + x.tam > ORCAMENTO) continue;
    secaoCompleta.add(x.si); usado += x.tam;
    SECOES[x.si].u.forEach((_, ui) => escolhidas.add(x.si + ':' + ui));
  }

  // 2) demais trechos pela ordem fundida, respeitando o orçamento e o teto por seção
  const porSecao = new Map();
  for (const u of candidatos) {
    if (secaoCompleta.has(u.si)) continue;
    const gasto = porSecao.get(u.si) || 0;
    if (usado + custo(u) > ORCAMENTO || gasto + custo(u) > (SECOES[u.si].max || MAX_POR_SECAO)) continue;   // "max" opcional por seção (ex.: treinamento)
    escolhidas.add(u.si + ':' + u.ui); usado += custo(u); porSecao.set(u.si, gasto + custo(u));
  }
  if (!escolhidas.size) return null;

  // 3) monta o texto na ordem original
  const partes = [];
  SECOES.forEach((s, si) => {
    if (s.f) { partes.push(`## ${s.t}\n${s.c}`); return; }
    const linhas = []; let cabAtual = null;
    (s.u || []).forEach(([cab, txt], ui) => {
      if (!escolhidas.has(si + ':' + ui)) return;
      if (cab && cab !== cabAtual) linhas.push(cab);
      cabAtual = cab; linhas.push(txt);
    });
    if (linhas.length) partes.push(`## ${s.t}${secaoCompleta.has(si) ? '' : ' (trechos selecionados)'}\n${linhas.join('\n')}`);
  });
  return partes.join('\n\n');
}

/** Só palavras-chave (síncrono). */
export function selecionarContexto(messages) { return montar(messages, null); }

/** Palavras-chave + significado. Nunca falha: em qualquer problema usa só palavras-chave. */
export async function selecionarContextoHibrido(messages, env, ctx) {
  let semantico = null;
  try { semantico = await comPrazo(buscaSemantica(messages, env, ctx), PRAZO_MS); }
  catch (e) { if (String(e) !== 'Error: prazo') console.error('busca semantica', String(e).slice(0, 200)); }
  return montar(messages, semantico);
}

/** Diagnóstico: a busca por significado já está pronta nesta instância? */
export const buscaSemanticaPronta = () => !!VETORES;

/** Para testes. */
export const _interno = { indice, hashBase, textoDoTrecho, reiniciar() { VETORES = null; CONSTRUINDO = null; FALHOU_EM = 0; } };
