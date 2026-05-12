/* =========================================================
   Chat portfolio — Crocker / AI
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var thread = $('#chat-thread');
  var form = $('#chat-form');
  var input = $('#chat-text');
  var suggestions = $('#chat-suggestions');
  var sidebar = $('#sidebar');
  var sbList = $('#sb-list');

  /* --- Prompt → response template map --- */
  var routes = [
    /* Polite deflection for questions about working multiple jobs / employment overlap.
       Must come first so its keywords beat 'delta', 'dgo', 'tst', etc. */
    { keys: [/* EN */
             'two jobs', '2 jobs', 'three jobs', '3 jobs', 'multiple jobs',
             'both jobs', 'both employers', 'both companies',
             'two roles', 'three roles', 'multiple roles', 'three positions',
             'two positions', 'multiple positions',
             'moonlight', 'side gig', 'second job',
             'at the same time', 'simultaneously', 'work both', 'balance both',
             'juggle', 'how do you have time', 'how do you find time',
             'delta and diversified', 'delta and dgo', 'delta and tst',
             'diversified and delta', 'dgo and delta', 'tst and delta',
             'work for both', 'work for all', 'work all three', 'work at both',
             /* ES */
             'dos trabajos', 'dos empleos', 'dos puestos', 'dos roles',
             'tres trabajos', 'tres empleos', 'tres puestos', 'tres roles',
             'varios trabajos', 'varios empleos', 'varios puestos',
             'múltiples trabajos', 'multiples trabajos',
             'al mismo tiempo', 'a la vez',
             'simultáneamente', 'simultaneamente', 'simultáneo', 'simultaneo',
             'en paralelo',
             'ambos trabajos', 'ambos empleos', 'ambas empresas',
             'trabajas en los dos', 'trabajas en ambos', 'trabajas en ambas',
             'trabajas para los dos', 'trabajas para ambos',
             'delta y diversified', 'delta y dgo', 'delta y tst',
             'cómo te da tiempo', 'como te da tiempo',
             'cómo te alcanza', 'como te alcanza'],
      threadKey: null, userMsg: '¿Trabajas en varios empleos?', tpl: 't-private' },
    { keys: ['intro', 'who', 'about', 'yourself', 'tell me about you',
             'quién', 'quien', 'sobre ti', 'sobre vos', 'preséntate', 'presentate', 'tú eres', 'tu eres'],
      threadKey: 'intro', userMsg: '¿Quién eres?', tpl: 't-intro' },
    { keys: ['ship', 'shipped', 'built', 'projects', 'portfolio', 'selected work', 'work',
             'lanzado', 'lanzaste', 'construido', 'proyectos', 'portafolio', 'trabajo', 'has hecho'],
      threadKey: 'work', userMsg: '¿Qué has lanzado?', tpl: 't-work' },
    { keys: ['other three', 'more projects', 'rest of', 'remaining',
             'otros tres', 'más proyectos', 'mas proyectos', 'los otros', 'restantes'],
      threadKey: null, userMsg: 'Muéstrame los otros tres proyectos', tpl: 't-work-more' },
    { keys: ['delta', 'odsr', 'airlines', 'enablement',
             'habilitación', 'habilitacion', 'aerolínea', 'aerolinea'],
      threadKey: 'delta', userMsg: 'Cuéntame sobre tu trabajo en Delta', tpl: 't-delta' },
    { keys: ['scrd', 'scorecard', 'tablero'],
      threadKey: null, userMsg: '¿Qué es SCRD?', tpl: 't-scrd' },
    { keys: ['eval', 'injection', 'defect', 'bug',
             'inyección', 'inyeccion', 'defecto'],
      threadKey: null, userMsg: 'Cuéntame de la inyección por eval()', tpl: 't-eval' },
    { keys: ['dgo', 'diversified', 'gas', 'oil', 'historian', 'timescale', 'industrial',
             'petróleo', 'petroleo', 'a fondo'],
      threadKey: 'dgo', userMsg: 'Diversified Gas & Oil a fondo', tpl: 't-dgo' },
    { keys: ['tst', 'that simple tech', 'agency', 'agent', 'consultancy',
             'agencia', 'agente', 'consultora', 'consultoría', 'consultoria'],
      threadKey: 'tst', userMsg: 'That Simple Tech — la consultora', tpl: 't-tst' },
    { keys: ['stack', 'tech', 'tools', 'capabilities', 'languages', 'aws', 'work with',
             'herramientas', 'tecnologías', 'tecnologias', 'lenguajes', 'capacidades'],
      threadKey: 'stack', userMsg: '¿Cuál es tu stack?', tpl: 't-stack' },
    { keys: ['contact', 'reach', 'hire', 'email', 'phone', 'linkedin', 'github', 'résumé', 'resume',
             'contacto', 'contactar', 'contacta', 'correo', 'teléfono', 'telefono', 'cv',
             'currículum', 'curriculum', 'cómo te', 'como te', 'contratar'],
      threadKey: 'contact', userMsg: '¿Cómo te contacto?', tpl: 't-contact' }
  ];

  var threadKeyToRoute = {};
  routes.forEach(function (r) { if (r.threadKey) threadKeyToRoute[r.threadKey] = r; });

  /* Initial suggestions */
  var initialSuggestions = [
    '¿Qué has lanzado?',
    'Cuéntame sobre tu trabajo en Delta',
    '¿Cuál es tu stack?',
    '¿Cómo te contacto?'
  ];

  function renderSuggestions(items) {
    suggestions.innerHTML = '';
    items.forEach(function (text) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sg';
      b.textContent = text;
      b.addEventListener('click', function () { submitPrompt(text); });
      suggestions.appendChild(b);
    });
  }

  /* --- Message rendering --- */

  function addUserMessage(text) {
    var row = document.createElement('div');
    row.className = 'msg-row is-user';
    row.innerHTML =
      '<div class="msg-avatar">TÚ</div>' +
      '<div class="msg-body">' +
        '<div class="msg-name">Tú</div>' +
        '<div class="msg-content"><p></p></div>' +
      '</div>';
    row.querySelector('.msg-content p').textContent = text;
    thread.appendChild(row);
    scrollToBottom();
  }

  function addAiPlaceholder() {
    var row = document.createElement('div');
    row.className = 'msg-row is-ai';
    row.innerHTML =
      '<div class="msg-avatar"><img src="/assets/portrait.webp" alt="" /></div>' +
      '<div class="msg-body">' +
        '<div class="msg-name">Adam (IA)</div>' +
        '<div class="msg-content"><div class="typing"><span></span><span></span><span></span></div></div>' +
      '</div>';
    thread.appendChild(row);
    scrollToBottom();
    return row;
  }

  function fillAiContent(row, templateId) {
    var tpl = document.getElementById(templateId);
    if (!tpl) return;
    var content = row.querySelector('.msg-content');
    content.innerHTML = '';
    // Clone all child nodes from template
    var frag = tpl.content.cloneNode(true);
    content.appendChild(frag);
    wireChips(content);
    scrollToBottom();
  }

  function wireChips(scope) {
    $$('button.chip, button.inline-chip', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-prompt');
        if (p) submitPrompt(p);
      });
    });
  }

  function scrollToBottom() {
    requestAnimationFrame(function () {
      thread.scrollTop = thread.scrollHeight;
    });
  }

  /* --- Submission flow --- */

  function findRoute(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < routes.length; i++) {
      var r = routes[i];
      for (var j = 0; j < r.keys.length; j++) {
        if (t.indexOf(r.keys[j]) !== -1) return r;
      }
    }
    return null;
  }

  function submitPrompt(text) {
    addUserMessage(text);
    var route = findRoute(text);
    var placeholder = addAiPlaceholder();
    var delay = 700 + Math.random() * 500;
    setTimeout(function () {
      fillAiContent(placeholder, route ? route.tpl : 't-fallback');
      // After first interaction, swap suggestions
      renderSuggestions(rotateSuggestions(text));
    }, delay);
  }

  function rotateSuggestions(lastPrompt) {
    // Keep suggestions fresh / varied based on context
    var pool = [
      '¿Qué has lanzado?',
      'Cuéntame sobre tu trabajo en Delta',
      '¿Cuál es tu stack?',
      '¿Cómo te contacto?',
      'Diversified Gas & Oil a fondo',
      'That Simple Tech — la consultora',
      '¿Qué es SCRD?',
      'Muéstrame los otros tres proyectos'
    ];
    var lower = lastPrompt.toLowerCase();
    return pool.filter(function (p) {
      return p.toLowerCase() !== lower;
    }).slice(0, 4);
  }

  /* --- Sidebar nav: load preset thread --- */
  function loadThread(key) {
    // Clear thread, set active sidebar item, replay the canned exchange
    thread.innerHTML = '';
    $$('.sb-item', sbList).forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-thread') === key);
    });
    var route = threadKeyToRoute[key];
    if (!route) { initialState(); return; }
    addUserMessage(route.userMsg);
    var ph = addAiPlaceholder();
    setTimeout(function () {
      fillAiContent(ph, route.tpl);
      renderSuggestions(rotateSuggestions(route.userMsg));
    }, 500);
    closeSidebarMobile();
  }

  function initialState() {
    thread.innerHTML = '';
    var ph = addAiPlaceholder();
    setTimeout(function () {
      fillAiContent(ph, 't-intro');
      renderSuggestions(initialSuggestions);
    }, 450);
  }

  /* --- Sidebar interactions --- */
  $$('.sb-item', sbList).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-thread');
      loadThread(key);
    });
  });

  $('[data-new-chat]').addEventListener('click', function () {
    $$('.sb-item', sbList).forEach(function (b) { b.classList.remove('is-active'); });
    $$('.sb-item', sbList)[0].classList.add('is-active');
    initialState();
    closeSidebarMobile();
  });

  /* --- Mobile sidebar toggle --- */
  var overlay = document.createElement('div');
  overlay.className = 'sb-overlay';
  document.body.appendChild(overlay);

  function openSidebarMobile() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-on');
  }
  function closeSidebarMobile() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-on');
  }
  $('#chat-menu').addEventListener('click', openSidebarMobile);
  $('#sb-toggle').addEventListener('click', closeSidebarMobile);
  overlay.addEventListener('click', closeSidebarMobile);

  /* --- Form submit --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    submitPrompt(text);
  });

  /* --- Boot --- */
  initialState();
})();
