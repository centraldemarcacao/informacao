// Gera src/treinamento-base.js a partir do treinamento.js do site (módulos com pronto:true).
// Uso: node scripts/build-treinamento.mjs   (rode dentro de worker/)
// Quando Oncologia Clínica ou Hematologia ficarem prontas (pronto: true) entram sozinhas.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const entrada = process.env.TREINAMENTO_JS || fileURLToPath(new URL('../../treinamento.js', import.meta.url));
const saida = fileURLToPath(new URL('../src/treinamento-base.js', import.meta.url));

let codigo;
try { codigo = readFileSync(entrada, 'utf8'); }
catch { console.error(`ERRO: não encontrei ${entrada}\nEnvie o treinamento.js para a RAIZ do repositório (ao lado de index.html).`); process.exit(1); }
const TREINO = vm.runInNewContext(codigo + '\n;TREINO', {});
const limpa = (s) => String(s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

function blocoTexto(b) {
  switch (b.t) {
    case 'p': case 'alerta': return limpa(b.x);
    case 'lista': return b.itens.map((i) => '- ' + limpa(i)).join('\n');
    case 'passos': return b.itens.map((i, n) => `${n + 1}. ${limpa(i.t)}: ${limpa(i.x)}`).join('\n');
    case 'tabela': return b.linhas.map((l) => '- ' + l.map((c, i) => `${limpa(b.cab[i])}: ${limpa(c)}`).join(' | ')).join('\n');
    case 'contato': return `Contato ${b.nome}: ${b.tel} (${b.via === 'whatsapp' ? 'WhatsApp' : 'ligação'})${b.obs ? ' — ' + limpa(b.obs) : ''}`;
    default: return '';
  }
}

const secoes = [];
for (const m of Object.values(TREINO).filter((x) => x.pronto)) {
  const u = [];
  u.push([`### ${m.titulo} — onde estudar`,
    `Para treinar ${m.titulo} existe a página treinamento.html (Guia de Treinamento): lições, árvore de decisão, cartões, quiz e simulador de atendimento.`]);
  for (const l of m.licoes) {
    u.push([`### ${m.titulo} — ${l.titulo}`,
      [limpa(l.resumo), ...l.blocos.map(blocoTexto).filter(Boolean), 'Pontos-chave: ' + l.chaves.map(limpa).join(' ')].join('\n')]);
  }
  for (const c of m.cola) {
    u.push([`### ${m.titulo} — consulta rápida`, `${limpa(c.t)}: ${limpa(c.r)}${c.tel ? ` Telefone: ${c.tel} (${c.via === 'whatsapp' ? 'WhatsApp' : 'ligação'}).` : ''}`]);
  }
  /* Palavras-chave da SEÇÃO: só o que indica pedido de treinamento. Termos amplos (médico, telefone, SUS...) aqui
     fariam o treinamento entrar em toda resposta e tomar o espaço de outras páginas. O texto dos trechos já é buscado. */
  const k = 'treinamento treinar treino guia aprender curso licao quiz simulador';
  secoes.push({ t: `Treinamento ${m.titulo} (treinamento.html) — fluxos de atendimento`, f: false, k, max: 4000, u });
}

const bloco = secoes.map((s) => '\n\n## ' + s.t + '\n' + s.u.map(([cab, txt]) => cab + '\n' + txt).join('\n')).join('');
writeFileSync(saida,
  `// ARQUIVO GERADO por scripts/build-treinamento.mjs em ${new Date().toISOString()} — não edite à mão.\n` +
  `export const SECOES_TREINAMENTO = ${JSON.stringify(secoes)};\n` +
  `export const BLOCO_TREINAMENTO = ${JSON.stringify(bloco)};\n`);
console.log(`treinamento-base.js: ${secoes.length} módulo(s), ${secoes.reduce((a, s) => a + s.u.length, 0)} trechos`);
