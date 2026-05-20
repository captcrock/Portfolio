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
    { keys: ['two jobs', '2 jobs', 'three jobs', '3 jobs', 'multiple jobs',
             'both jobs', 'both employers', 'both companies',
             'two roles', 'three roles', 'multiple roles', 'three positions',
             'two positions', 'multiple positions',
             'moonlight', 'side gig', 'second job',
             'at the same time', 'simultaneously', 'work both', 'balance both',
             'juggle', 'how do you have time', "how do you find time",
             'delta and diversified', 'delta and dgo', 'delta and tst',
             'diversified and delta', 'dgo and delta', 'tst and delta',
             'work for both', 'work for all', 'work all three', 'work at both'],
      threadKey: null, userMsg: 'Do you work multiple jobs?', tpl: 't-private' },
    { keys: ['partners', 'partner', 'who have you', 'organizations', 'clients',
             'employers', 'companies', 'worked with', 'worked for', 'where have you'],
      threadKey: 'partners', userMsg: "Who have you partnered with?", tpl: 't-partners' },
    { keys: ['intro', 'who', 'about', 'yourself', 'tell me about you'],
      threadKey: 'intro', userMsg: 'Who are you?', tpl: 't-intro' },
    { keys: ['ship', 'shipped', 'built', 'projects', 'portfolio', 'selected work', 'work'],
      threadKey: 'work', userMsg: 'What have you shipped?', tpl: 't-work' },
    { keys: ['other three', 'more projects', 'rest of', 'remaining'],
      threadKey: null, userMsg: 'Show me the other three projects', tpl: 't-work-more' },
    { keys: ['delta', 'odsr', 'airlines', 'enablement'],
      threadKey: 'delta', userMsg: 'Tell me about your Delta work', tpl: 't-delta' },
    { keys: ['scrd', 'scorecard'],
      threadKey: null, userMsg: 'What is SCRD?', tpl: 't-scrd' },
    { keys: ['eval', 'injection', 'defect', 'bug'],
      threadKey: null, userMsg: 'Tell me about the eval() injection', tpl: 't-eval' },
    { keys: ['dgo', 'diversified', 'gas', 'oil', 'historian', 'timescale', 'industrial'],
      threadKey: 'dgo', userMsg: 'Diversified Gas & Oil deep-dive', tpl: 't-dgo' },
    { keys: ['tst', 'that simple tech', 'agency', 'agent', 'consultancy'],
      threadKey: 'tst', userMsg: 'That Simple Tech — the agency thing', tpl: 't-tst' },
    { keys: ['stack', 'tech', 'tools', 'capabilities', 'languages', 'aws', 'work with'],
      threadKey: 'stack', userMsg: "What's your stack?", tpl: 't-stack' },
    { keys: ['contact', 'reach', 'hire', 'email', 'phone', 'linkedin', 'github', 'résumé', 'resume'],
      threadKey: 'contact', userMsg: 'How do I reach you?', tpl: 't-contact' }
  ];

  var threadKeyToRoute = {};
  routes.forEach(function (r) { if (r.threadKey) threadKeyToRoute[r.threadKey] = r; });

  /* Initial suggestions */
  var initialSuggestions = [
    'What have you shipped?',
    "What's your stack?",
    "Who have you partnered with?",
    'How do I reach you?'
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
      '<div class="msg-avatar">YOU</div>' +
      '<div class="msg-body">' +
        '<div class="msg-name">You</div>' +
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
        '<div class="msg-name">Adam (AI)</div>' +
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
      'What have you shipped?',
      "What's your stack?",
      "Who have you partnered with?",
      'How do I reach you?',
      'What is SCRD?',
      'Show me the other three projects'
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
