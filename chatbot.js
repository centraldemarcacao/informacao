/*!
 * chatbot.js — widget de chat para GitHub Pages.
 * Uso (antes de </body>):
 *   <link rel="stylesheet" href="chatbot.css">
 *   <script src="chatbot.js" data-endpoint="https://chatbot-liga.SEU-SUBDOMINIO.workers.dev" defer></script>
 * Nenhuma chave de API aqui: o navegador só fala com o seu Worker.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var ENDPOINT = (script && script.getAttribute('data-endpoint')) || '';
  var TITULO = (script && script.getAttribute('data-title')) || 'Assistente da Central';
  var MAX_HIST = 10;           // mensagens enviadas como contexto
  var MAX_CHARS = 1500;        // mesmo limite do Worker
  var TIMEOUT_MS = 60000;
  var PAGINAS = ['index', 'oncologia', 'quimioterapia', 'radioterapia', 'ultrassonografia', 'anotacoes', 'telefonia', 'triagem'];
  var SUGESTOES = ['Quais médicos atendem Mama?', 'Qual o intervalo de retorno da Capecitabina?', 'Telefone do Pronto-Socorro', 'Como registrar uma triagem?'];

  var historico = [];          // [{role, content}]
  var ocupado = false, ctrl = null;

  function store(op, v) { try { return op === 'get' ? sessionStorage.getItem('lg_chat') : sessionStorage.setItem('lg_chat', v); } catch (e) { return null; } }
  try { historico = JSON.parse(store('get') || '[]').filter(function (m) { return m && m.role && typeof m.content === 'string'; }); } catch (e) { historico = []; }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  /* ---------- markdown mínimo e seguro (escapa HTML antes) ---------- */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function inline(s) {
    s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
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

  /* ---------- interface ---------- */
  var root = el('div', 'lg-chat'); root.setAttribute('role', 'complementary'); root.setAttribute('aria-label', TITULO);
  var fab = el('button', 'lg-fab', '💬'); fab.type = 'button'; fab.setAttribute('aria-label', 'Abrir assistente de dúvidas');
  var panel = el('div', 'lg-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', TITULO);

  var head = el('div', 'lg-head');
  head.appendChild(el('div', 'lg-av', '🤖'));
  var t = el('div', 'lg-t'); t.appendChild(el('strong', null, TITULO)); t.appendChild(el('small', null, 'Responde com base nas páginas deste site'));
  head.appendChild(t);
  var bNovo = el('button', null, '↺'); bNovo.type = 'button'; bNovo.title = 'Nova conversa'; bNovo.setAttribute('aria-label', 'Nova conversa');
  var bFechar = el('button', null, '✕'); bFechar.type = 'button'; bFechar.title = 'Fechar'; bFechar.setAttribute('aria-label', 'Fechar assistente');
  head.appendChild(bNovo); head.appendChild(bFechar);

  var msgs = el('div', 'lg-msgs'); msgs.setAttribute('aria-live', 'polite');
  var form = el('form', 'lg-form');
  var ta = el('textarea'); ta.rows = 1; ta.maxLength = MAX_CHARS; ta.placeholder = 'Digite sua dúvida…'; ta.setAttribute('aria-label', 'Sua pergunta');
  var send = el('button', 'lg-send', '➤'); send.type = 'submit'; send.setAttribute('aria-label', 'Enviar');
  form.appendChild(ta); form.appendChild(send);
  var foot = el('div', 'lg-foot', 'IA pode errar. Não substitui orientação médica nem a confirmação com a equipe. Não envie CPF ou dados de exames.');

  panel.appendChild(head); panel.appendChild(msgs); panel.appendChild(form); panel.appendChild(foot);
  root.appendChild(fab); root.appendChild(panel); document.body.appendChild(root);

  function rolar() { msgs.scrollTop = msgs.scrollHeight; }
  function bolha(role, texto) {
    var b = el('div', 'lg-m ' + (role === 'user' ? 'user' : 'bot'));
    if (role === 'user') b.textContent = texto; else b.innerHTML = render(texto);
    msgs.appendChild(b); rolar(); return b;
  }
  function boasVindas() {
    msgs.innerHTML = '';
    bolha('bot', 'Olá! 👋 Posso ajudar com dúvidas sobre **triagem, oncologia, quimioterapia, radioterapia, ultrassonografia e telefonia**. O que você precisa?');
    var s = el('div', 'lg-sug');
    SUGESTOES.forEach(function (q) { var b = el('button', null, q); b.type = 'button'; b.onclick = function () { enviar(q); }; s.appendChild(b); });
    msgs.appendChild(s);
  }
  function restaurar() {
    if (!historico.length) return boasVindas();
    msgs.innerHTML = '';
    historico.forEach(function (m) { bolha(m.role, m.content); });
  }
  function abrir() { root.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); setTimeout(function () { ta.focus(); rolar(); }, 50); }
  function fechar() { root.classList.remove('open'); fab.focus(); }

  fab.onclick = abrir; bFechar.onclick = fechar;
  bNovo.onclick = function () { if (ctrl) ctrl.abort(); historico = []; store('set', '[]'); ocupado = false; send.disabled = false; boasVindas(); ta.focus(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('open')) fechar(); });
  ta.addEventListener('input', function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; });
  ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); enviar(ta.value); });

  /* ---------- envio + streaming ---------- */
  function enviar(texto) {
    texto = (texto || '').trim().slice(0, MAX_CHARS);
    if (!texto || ocupado) return;
    if (!ENDPOINT) { bolha('bot', 'Assistente não configurado (falta o data-endpoint).').classList.add('err'); return; }
    var sug = msgs.querySelector('.lg-sug'); if (sug) sug.remove();
    ocupado = true; send.disabled = true; ta.value = ''; ta.style.height = 'auto';
    historico.push({ role: 'user', content: texto }); bolha('user', texto);

    var b = el('div', 'lg-m bot'); var dots = el('span', 'lg-typing'); dots.innerHTML = '<i></i><i></i><i></i>';
    b.appendChild(dots); msgs.appendChild(b); rolar();

    ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    var acumulado = '';

    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
      body: JSON.stringify({ messages: historico.slice(-MAX_HIST) })
    }).then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.erro || 'Erro ' + r.status); });
      var reader = r.body.getReader(), dec = new TextDecoder();
      return (function ler() {
        return reader.read().then(function (x) {
          if (x.done) return;
          acumulado += dec.decode(x.value, { stream: true });
          b.innerHTML = render(acumulado); rolar();
          return ler();
        });
      })();
    }).then(function () {
      if (!acumulado.trim()) throw new Error('Resposta vazia.');
      historico.push({ role: 'assistant', content: acumulado });
    }).catch(function (err) {
      historico.pop();   // remove a pergunta sem resposta, para o histórico continuar alternando
      b.className = 'lg-m bot err';
      b.textContent = err.name === 'AbortError' ? 'A resposta demorou demais. Tente novamente.' : (err.message || 'Falha de conexão.') ;
    }).then(function () {
      clearTimeout(to); ocupado = false; send.disabled = false;
      store('set', JSON.stringify(historico.slice(-MAX_HIST))); ta.focus();
    });
  }

  restaurar();
})();
