/*!
 * chatbot.js — VERSÃO 2026-10-30 (balão volta 60 s após o clique)
 * Widget de chat para GitHub Pages (visual alinhado ao site da Central de Marcação).
 * Uso (antes de </body>):
 *   <link rel="stylesheet" href="chatbot.css">
 *   <script src="chatbot.js" data-endpoint="https://chatbot-liga.SEU-SUBDOMINIO.workers.dev" defer></script>
 * Opcionais no <script>: data-title="..." data-subtitle="..." data-avatar="imagem.png"
 * Nenhuma chave de API aqui: o navegador só fala com o seu Worker.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var attr = function (n, pad) { return (script && script.getAttribute(n)) || pad; };
  var ENDPOINT = attr('data-endpoint', '');
  var TITULO = attr('data-title', 'Assistente da Central');
  var SUBTITULO = attr('data-subtitle', 'Apoio ao atendimento');
  /* IMAGEM do assistente (logo/mascote): arquivo na mesma pasta das páginas, ex.: 'assistente.png'. '' = ícone padrão. */
  var AVATAR = attr('data-avatar', '');
  var AVATAR_NO_BOTAO = true;  // true = a imagem também aparece no botão flutuante
  var MAX_HIST = 10;           // mensagens enviadas como contexto
  var MAX_CHARS = 1500;        // mesmo limite do Worker
  var TIMEOUT_MS = 60000;
  var DICA_VOLTA_MS = 60000;   // quanto tempo depois de clicado o balão "Dúvidas? Pergunte aqui" reaparece (60 s)
  var PAGINAS = ['index', 'oncologia', 'quimioterapia', 'radioterapia', 'ultrassonografia', 'anotacoes', 'telefonia', 'triagem'];

  /* ATALHOS da tela inicial. Edite à vontade: ico (emoji), t (título curto), q (pergunta enviada), bg (cor do quadradinho).
     Também aceita só textos: ['Pergunta 1', 'Pergunta 2']. Use de 2 a 4. */
  var SUGESTOES = [
    { ico: '♋', t: 'Médicos por área', q: 'Quais médicos atendem Mama?', bg: '#fce4ec' },
    { ico: '💉', t: 'Retorno da quimioterapia', q: 'Qual o intervalo de retorno da Capecitabina?', bg: '#f3e5f5' },
    { ico: '☎️', t: 'Telefones dos setores', q: 'Telefone do Pronto-Socorro', bg: '#e0f2f1' },
    { ico: '🩺', t: 'Registrar triagem', q: 'Como registrar uma triagem?', bg: '#e3f2fd' }
  ];

  var historico = [];          // [{role, content, t}]
  var ocupado = false, ctrl = null;

  function store(chave, v) {
    try { return v === undefined ? sessionStorage.getItem(chave) : sessionStorage.setItem(chave, v); } catch (e) { return null; }
  }
  try { historico = JSON.parse(store('lg_chat') || '[]').filter(function (m) { return m && m.role && typeof m.content === 'string'; }); } catch (e) { historico = []; }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  /* ---------- ícones (SVG embutido, sem dependências) ---------- */
  var ICO = {
    chat: '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M5 3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6.2L8 21.2V17H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/><path stroke="#0d3b66" stroke-width="2.2" stroke-linecap="round" d="M12 6.6v6.2M8.9 9.7h6.2"/></svg>',
    cruz: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path stroke="#fff" stroke-width="2.6" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
    cruzP: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path stroke="#fff" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
    fechar: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
    novo: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/></svg>',
    enviar: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6l.1 6.5L15 12 3.5 13.9z"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2"/><path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M12 11v5.2M12 7.6v.1"/></svg>',
    alerta: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3.5 22 20H2z"/><path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M12 10v4.4M12 17.4v.1"/></svg>'
  };
  function icone(html, cls) { var s = el('span', cls); s.style.display = 'contents'; s.innerHTML = html; return s; }

  /* ---------- markdown mínimo e seguro (escapa HTML antes) ---------- */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function inline(s) {
    s = esc(s)
      .replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>')   // **negrito** (markdown)
      .replace(/\*\s*([^*\n]+?)\s*\*/g, '<strong>$1</strong>');    // *negrito* (estilo WhatsApp das mensagens prontas)
    return s.replace(new RegExp('\\b(' + PAGINAS.join('|') + ')\\.html\\b', 'g'), '<a href="$1.html">$1.html</a>');
  }
  function render(md) {
    var out = '', lista = false;
    md.split('\n').forEach(function (l) {
      var m = /^\s*[-*•]\s+(.*)$/.exec(l);
      if (m) { if (!lista) { out += '<ul>'; lista = true; } out += '<li>' + inline(m[1]) + '</li>'; return; }
      if (lista) { out += '</ul>'; lista = false; }
      if (l.trim()) out += '<p>' + inline(l.replace(/^#+\s*/, '')) + '</p>';
    });
    return out + (lista ? '</ul>' : '');
  }
  function hora(d) { return (d || new Date()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }

  /* ---------- imagem opcional (cai no ícone se o arquivo não carregar) ---------- */
  function comImagem(box, padrao) {
    box.innerHTML = ''; box.appendChild(icone(padrao));
    if (!AVATAR) return;
    var img = document.createElement('img');
    img.alt = ''; img.decoding = 'async'; img.draggable = false;
    img.onload = function () { box.innerHTML = ''; box.appendChild(img); box.classList.add('com-img'); };
    img.src = AVATAR;
  }

  /* ---------- estrutura ---------- */
  var root = el('div', 'lg-chat'); root.setAttribute('role', 'complementary'); root.setAttribute('aria-label', TITULO);

  var launch = el('div', 'lg-launch');
  var dica = el('div', 'lg-dica', 'Dúvidas? Pergunte aqui');
  var fab = el('button', 'lg-fab'); fab.type = 'button'; fab.setAttribute('aria-label', 'Abrir assistente de dúvidas'); fab.setAttribute('aria-expanded', 'false');
  if (AVATAR_NO_BOTAO && AVATAR) comImagem(fab, ICO.chat); else fab.innerHTML = ICO.chat;
  launch.appendChild(dica); launch.appendChild(fab);

  var panel = el('div', 'lg-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', TITULO);

  var head = el('div', 'lg-head');
  var av = el('div', 'lg-av'); comImagem(av, ICO.cruz); head.appendChild(av);
  var t = el('div', 'lg-t'); t.appendChild(el('strong', null, TITULO));
  var sub = el('small'); sub.appendChild(el('i')); sub.appendChild(document.createTextNode(SUBTITULO)); t.appendChild(sub);
  head.appendChild(t);
  var bNovo = el('button', 'lg-ib'); bNovo.type = 'button'; bNovo.title = 'Nova conversa'; bNovo.setAttribute('aria-label', 'Nova conversa'); bNovo.innerHTML = ICO.novo;
  var bFechar = el('button', 'lg-ib'); bFechar.type = 'button'; bFechar.title = 'Fechar'; bFechar.setAttribute('aria-label', 'Fechar assistente'); bFechar.innerHTML = ICO.fechar;
  head.appendChild(bNovo); head.appendChild(bFechar);

  var aviso = el('div', 'lg-aviso'); aviso.setAttribute('role', 'note');
  aviso.appendChild(icone(ICO.info));
  aviso.appendChild(el('span', null, 'As respostas vêm das páginas do site. Confirme informações importantes com a gestão ou o setor responsável.'));

  var msgs = el('div', 'lg-msgs'); msgs.setAttribute('aria-live', 'polite');
  var form = el('form', 'lg-form');
  var ta = el('textarea'); ta.rows = 1; ta.maxLength = MAX_CHARS; ta.placeholder = 'Escreva sua dúvida'; ta.setAttribute('aria-label', 'Sua pergunta');
  var send = el('button', 'lg-send'); send.type = 'submit'; send.setAttribute('aria-label', 'Enviar'); send.title = 'Enviar'; send.innerHTML = ICO.enviar;
  form.appendChild(ta); form.appendChild(send);
  var foot = el('div', 'lg-foot', 'A IA pode errar. Não digite dados de pacientes (nome, CPF, exames).');

  panel.appendChild(head); panel.appendChild(aviso); panel.appendChild(msgs); panel.appendChild(form); panel.appendChild(foot);
  root.appendChild(panel); root.appendChild(launch); document.body.appendChild(root);

  /* ---------- mensagens ---------- */
  function rolar() { msgs.scrollTop = msgs.scrollHeight; }

  /** Cria uma linha de mensagem. Devolve { row, bolha, hora }. */
  function linha(role, quando) {
    var row = el('div', 'lg-row ' + (role === 'user' ? 'user' : 'bot'));
    if (role !== 'user') { var b = el('div', 'lg-bav'); comImagem(b, ICO.cruzP); row.appendChild(b); }
    var col = el('div', 'lg-col'), bolha = el('div', 'lg-m ' + (role === 'user' ? 'user' : 'bot'));
    col.appendChild(bolha);
    var h = el('span', 'lg-hora', quando || ''); if (quando) col.appendChild(h);
    row.appendChild(col); msgs.appendChild(row);
    return { row: row, bolha: bolha, col: col };
  }
  function mensagem(role, texto, quando) {
    var l = linha(role, quando);
    if (role === 'user') l.bolha.textContent = texto; else l.bolha.innerHTML = render(texto);
    rolar(); return l;
  }
  function boasVindas() {
    msgs.innerHTML = '';
    var l = linha('bot');
    l.bolha.innerHTML = render('Olá! Sou o assistente de apoio da Central de Marcação.\nEscolha um assunto ou escreva sua dúvida de atendimento.');
    var s = el('div', 'lg-sug');
    SUGESTOES.forEach(function (x) {
      if (typeof x === 'string') x = { ico: '💬', t: x, q: x, bg: '#e3f2fd' };
      var b = el('button'); b.type = 'button';
      var i = el('span', 'lg-si', x.ico || '💬'); i.style.setProperty('--bg-c', x.bg || '#e3f2fd'); i.setAttribute('aria-hidden', 'true');
      b.appendChild(i); b.appendChild(el('span', null, x.t)); b.title = x.q;
      b.onclick = function () { enviar(x.q); };
      s.appendChild(b);
    });
    msgs.appendChild(s);
  }
  function restaurar() {
    if (!historico.length) return boasVindas();
    msgs.innerHTML = '';
    historico.forEach(function (m) { mensagem(m.role, m.content, m.t); });
    rolar();
  }
  /* Balão "Dúvidas? Pergunte aqui": some quando o chat é aberto e volta DICA_VOLTA_MS depois (60 s).
     Se o chat ainda estiver aberto nessa hora, o balão volta assim que ele for fechado. */
  var dicaTimer = null, dicaPronta = false;
  function mostrarDica() {
    if (root.classList.contains('open')) { dicaPronta = true; return; }
    dicaPronta = false; dica.style.display = '';
    dica.style.animation = 'none'; void dica.offsetWidth; dica.style.animation = '';   // repete a entrada suave
  }
  function esconderDicaEAgendar() {
    dica.style.display = 'none'; dicaPronta = false;
    clearTimeout(dicaTimer); dicaTimer = setTimeout(mostrarDica, DICA_VOLTA_MS);
  }
  function abrir() {
    root.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); esconderDicaEAgendar();
    setTimeout(function () { ta.focus(); rolar(); }, 50);
  }
  function fechar() {
    root.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); fab.focus();
    if (dicaPronta) mostrarDica();
  }

  fab.onclick = abrir; dica.onclick = abrir; bFechar.onclick = fechar;
  bNovo.onclick = function () {
    if (ctrl) ctrl.abort();
    historico = []; store('lg_chat', '[]'); ocupado = false; send.disabled = false; boasVindas(); ta.focus();
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('open')) fechar(); });
  ta.addEventListener('input', function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; });
  ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); enviar(ta.value); });

  /* ---------- envio + streaming ---------- */
  function mostrarErro(l, texto, aoTentar) {
    l.bolha.className = 'lg-m bot err'; l.bolha.innerHTML = '';
    var et = el('div', 'lg-et'); et.appendChild(icone(ICO.alerta)); et.appendChild(el('span', null, texto));
    l.bolha.appendChild(et);
    if (aoTentar) {
      var r = el('button', 'lg-retry'); r.type = 'button'; r.appendChild(icone(ICO.novo)); r.appendChild(document.createTextNode('Tentar de novo'));
      r.onclick = aoTentar; l.bolha.appendChild(r);
    }
  }

  function enviar(texto) {
    texto = (texto || '').trim().slice(0, MAX_CHARS);
    if (!texto || ocupado) return;
    if (!ENDPOINT) { var cfg = linha('bot'); mostrarErro(cfg, 'Assistente não configurado (falta o data-endpoint).'); return; }
    var sug = msgs.querySelector('.lg-sug'); if (sug) sug.remove();
    ocupado = true; send.disabled = true; ta.value = ''; ta.style.height = 'auto';
    var quando = hora();
    historico.push({ role: 'user', content: texto, t: quando });
    var lu = mensagem('user', texto, quando);

    var lb = linha('bot'); var dots = el('span', 'lg-typing'); dots.innerHTML = '<i></i><i></i><i></i>';
    lb.bolha.appendChild(dots); rolar(); msgs.setAttribute('aria-busy', 'true');

    ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    var acumulado = '';

    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
      body: JSON.stringify({ messages: historico.slice(-MAX_HIST).map(function (m) { return { role: m.role, content: m.content }; }) })
    }).then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.erro || 'Erro ' + r.status); });
      var reader = r.body.getReader(), dec = new TextDecoder();
      return (function ler() {
        return reader.read().then(function (x) {
          if (x.done) return;
          acumulado += dec.decode(x.value, { stream: true });
          lb.bolha.innerHTML = render(acumulado); rolar();
          return ler();
        });
      })();
    }).then(function () {
      if (!acumulado.trim()) throw new Error('Resposta vazia.');
      var h = hora();
      historico.push({ role: 'assistant', content: acumulado, t: h });
      lb.col.appendChild(el('span', 'lg-hora', h));
    }).catch(function (err) {
      historico.pop();   // remove a pergunta sem resposta, para o histórico continuar alternando
      var msg = err.name === 'AbortError' ? 'A resposta demorou demais.' : (err.message || 'Não foi possível conectar.');
      mostrarErro(lb, msg, function () { lb.row.remove(); lu.row.remove(); enviar(texto); });
    }).then(function () {
      clearTimeout(to); ocupado = false; send.disabled = false; msgs.setAttribute('aria-busy', 'false');
      store('lg_chat', JSON.stringify(historico.slice(-MAX_HIST))); ta.focus(); rolar();
    });
  }

  restaurar();
})();
