/* =========================================================
   crockerOS — desktop theme
   Window manager + apps
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ===== PROJECTS DATA =====
  var projects = [
    { id: 'historian', tag: 'DATA PLATFORM', org: 'Diversified Gas & Oil',
      title: 'Corporate Historian',
      desc: "Lead engineer on the central operational data warehouse. TimescaleDB with 15 schemas, 77 tables, 114 PL/pgSQL functions managing 1.6M+ daily production records. Star-schema with effective-dated dimensions, hypertables, continuous aggregates. ETL from CygNet SCADA, Snowflake, MNR; outbound to Grafana, regulatory reporting, volume control. Embedded pgai for automated issue detection over operator free-text and semantic search across historical observations.",
      stats: [['1.6M+', 'records / day'], ['114', 'pl/pgsql funcs'], ['15 / 77', 'schemas / tables']],
      chips: ['TimescaleDB', 'PL/pgSQL', 'pgai', 'Python', 'CygNet', 'Snowflake'] },
    { id: 'agency', tag: 'AI SYSTEMS', org: 'That Simple Tech',
      title: 'Autonomous AI Agency',
      desc: "10-agent system handling the full client lifecycle — intake, sales, scoping, build, QA, deploy, support, billing, comms, phone — across 8 project types. MiniMax M2.7 primary across roles (100% tool calling, ~3.3× cheaper, ~2.5× faster than the Claude API path); Gemini 3 Flash Preview for visual QA. Voice via Pipecat + Telnyx + Deepgram Nova; agents execute inside Cua sandboxes. SvelteKit client portal on Vercel with unified revision queue.",
      stats: [['10', 'agents'], ['8', 'project types'], ['~15×', 'cost reduction']],
      chips: ['MiniMax M2.7', 'Gemini 3 Flash', 'OpenRouter', 'Qwen Code', 'Pipecat', 'Telnyx', 'Deepgram Nova', 'Cua', 'SvelteKit', 'Stripe'] },
    { id: 'reporting', tag: 'AI AT SCALE', org: 'Delta Air Lines',
      title: 'Reporting Modernization v2',
      desc: "JSON-first replacement for three legacy operational scorecards (SCRD/ESR/MPR) — SCRD alone processing ~2,300 organizational entities per monthly close. Python packagers against Teradata, Step Functions parallel branch, DynamoDB caching, S3-backed registry; renderer collapsed to a single vanilla-JS viewer. AWS Bedrock (Claude Haiku 4.5) for auto-narratives and per-KPI explanations via /api/v1/kpi-explain. Closed seven latent defects en route — including an eval()-based templating injection.",
      stats: [['~2.3k', 'entities/closeout'], ['7', 'defects closed'], ['13', 'engineering docs']],
      chips: ['AWS Bedrock', 'Claude Haiku 4.5', 'Step Functions', 'DynamoDB', 'Glue (Python)', 'Lambda', 'API Gateway', 'S3', 'Teradata'] },
    { id: 'historian-ml', tag: 'ML PLATFORM', org: 'Diversified Gas & Oil',
      title: 'Historian ML',
      desc: "ML platform over 186M+ telemetry observations. Pattern-detection engine covering 8 categories of industrial sensor failure. Isolation Forest for unsupervised anomaly detection, Random Forest for pattern classification, LSTM for sensor-level forecasting. Packaged as an AWS CDK stack with a 580-line handoff runbook.",
      stats: [['186M+', 'observations'], ['8', 'failure categories'], ['3', 'model architectures']],
      chips: ['SageMaker', 'CDK', 'Python', 'Isolation Forest', 'LSTM'] },
    { id: 'cicd', tag: 'DEVOPS', org: 'Diversified Gas & Oil',
      title: 'Hybrid DB Migration CI/CD',
      desc: "5-stage Azure DevOps pipeline on a self-hosted Windows agent: validates, classifies, approves, executes, documents every schema change. Pattern-based SQL risk classifier (BLOCKED / HIGH / MEDIUM / LOW) over ~30 regex patterns. DROP TABLE foreign-key safeguard. Transactional execution with auto-rollback. SOX-aligned audit logging.",
      stats: [['5', 'stages'], ['~30', 'risk patterns'], ['SOX', 'audit-aligned']],
      chips: ['Azure DevOps', 'PowerShell', 'PostgreSQL', 'git'] },
    { id: 'field', tag: 'MOBILE', org: 'Diversified Gas & Oil',
      title: 'Field App',
      desc: "Ionic 8 + Angular 20 + Capacitor app replacing paper-based tank inspections. Single codebase deploys as native iOS / Android and installable PWA. Offline-first on Dexie / IndexedDB. AWS Amplify backend with AppSync GraphQL, DynamoDB, Cognito brokered with Azure AD via MSAL.",
      stats: [['3', 'targets, 1 codebase'], ['Offline', 'first'], ['SSO', 'Cognito ↔ Azure AD']],
      chips: ['Ionic 8', 'Angular 20', 'Capacitor', 'Dexie', 'AppSync', 'Cognito'] }
  ];

  // ===== BOOT SEQUENCE =====
  var bootStatus = $('#boot-status');
  var bootFill = $('.boot-fill');
  var bootMsgs = [
    'Initializing kernel…',
    'Loading display drivers…',
    'Mounting /home/adam…',
    'Connecting to AWS us-east-1…',
    'Starting WindowManager…',
    'Welcome.'
  ];

  function runBoot() {
    var i = 0;
    var total = bootMsgs.length;
    var iv = setInterval(function () {
      i++;
      if (i >= total) {
        clearInterval(iv);
        bootStatus.textContent = bootMsgs[total - 1];
        bootFill.style.width = '100%';
        setTimeout(function () {
          $('#boot').classList.add('is-done');
          // Open Terminal automatically as the welcome experience
          openApp('terminal');
        }, 350);
        return;
      }
      bootStatus.textContent = bootMsgs[i];
      bootFill.style.width = (i / (total - 1) * 100) + '%';
    }, 380);
  }

  // ===== CLOCK =====
  function tickClock() {
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    var clockEl = $('#mb-clock');
    var dateEl = $('#mb-date');
    if (clockEl) clockEl.textContent = hh + ':' + mm;
    if (dateEl) dateEl.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  tickClock();
  setInterval(tickClock, 30000);

  // ===== WINDOW MANAGER =====
  var z = 100;
  var openWindows = {}; // appId -> window el (for non-multi-instance apps)

  function makeWindow(opts) {
    z++;
    var w = document.createElement('div');
    w.className = 'win is-focused';
    w.style.left = (opts.x || (100 + Math.random() * 80)) + 'px';
    w.style.top  = (opts.y || (40 + Math.random() * 60)) + 'px';
    w.style.width = (opts.w || 720) + 'px';
    w.style.height = (opts.h || 480) + 'px';
    w.style.zIndex = z;
    w.dataset.app = opts.app || '';

    var head = document.createElement('div');
    head.className = 'win-head';
    head.innerHTML =
      '<div class="tlights">' +
        '<button class="tl-close" title="Close"></button>' +
        '<button class="tl-min" title="Minimize"></button>' +
        '<button class="tl-max" title="Zoom"></button>' +
      '</div>' +
      '<div class="win-title">' + (opts.title || '') + '</div>' +
      '<div style="width:54px"></div>'; // spacer for symmetry
    w.appendChild(head);

    var body = document.createElement('div');
    body.className = 'win-body';
    body.appendChild(opts.content);
    w.appendChild(body);

    // Close
    head.querySelector('.tl-close').addEventListener('click', function () {
      closeWindow(w);
    });
    // Max — toggle full size
    var maxed = false;
    var prev = {};
    head.querySelector('.tl-max').addEventListener('click', function () {
      if (!maxed) {
        prev = { left: w.style.left, top: w.style.top, width: w.style.width, height: w.style.height };
        w.style.left = '0px'; w.style.top = '0px';
        w.style.width = '100%'; w.style.height = '100%';
        maxed = true;
      } else {
        Object.assign(w.style, prev);
        maxed = false;
      }
    });
    // Min — collapse for ms then restore (decorative)
    head.querySelector('.tl-min').addEventListener('click', function () {
      w.style.transition = 'transform 250ms ease, opacity 250ms ease';
      w.style.transform = 'translateY(60vh) scale(0.4)';
      w.style.opacity = '0.3';
      setTimeout(function () {
        w.style.transform = '';
        w.style.opacity = '';
      }, 800);
    });

    // Drag
    makeDraggable(w, head);
    // Focus on click
    w.addEventListener('mousedown', function () { focusWindow(w); }, true);

    $('#windows').appendChild(w);
    return w;
  }

  function focusWindow(w) {
    z++;
    w.style.zIndex = z;
    $$('.win').forEach(function (el) { el.classList.toggle('is-focused', el === w); });
  }

  function closeWindow(w) {
    var app = w.dataset.app;
    w.classList.add('is-closing');
    setTimeout(function () {
      w.remove();
      if (app && openWindows[app] === w) {
        delete openWindows[app];
        var dockEl = $('.dock-app[data-open="' + app + '"]');
        if (dockEl) dockEl.classList.remove('is-open');
      }
    }, 200);
  }

  function makeDraggable(win, handle) {
    var dragging = false;
    var sx, sy, ox, oy;
    handle.addEventListener('mousedown', function (e) {
      if (e.target.closest('.tlights')) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(win.style.left) || 0;
      oy = parseFloat(win.style.top) || 0;
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      win.style.left = (ox + e.clientX - sx) + 'px';
      win.style.top = Math.max(0, oy + e.clientY - sy) + 'px';
    });
    window.addEventListener('mouseup', function () { dragging = false; });
    // touch
    handle.addEventListener('touchstart', function (e) {
      if (e.target.closest('.tlights')) return;
      var t = e.touches[0];
      dragging = true; sx = t.clientX; sy = t.clientY;
      ox = parseFloat(win.style.left) || 0;
      oy = parseFloat(win.style.top) || 0;
    });
    window.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var t = e.touches[0];
      win.style.left = (ox + t.clientX - sx) + 'px';
      win.style.top = Math.max(0, oy + t.clientY - sy) + 'px';
    });
    window.addEventListener('touchend', function () { dragging = false; });
  }

  // ===== APP LAUNCHER =====
  function openApp(appId, params) {
    // If a single-instance app is already open, just focus it
    if (openWindows[appId]) {
      focusWindow(openWindows[appId]);
      return openWindows[appId];
    }

    var tplId = 'app-' + appId;
    if (appId.indexOf('project:') === 0) tplId = 'app-project';
    var tpl = document.getElementById(tplId);
    if (!tpl) return;

    var content = tpl.content.cloneNode(true).firstElementChild;
    var title = '', w, h;

    // App-specific setup
    if (appId === 'terminal') {
      title = 'adam@crockerOS — Terminal';
      w = 720; h = 460;
      setupTerminal(content);
    } else if (appId === 'finder') {
      title = 'Finder — projects';
      w = 800; h = 520;
      setupFinder(content);
    } else if (appId === 'about') {
      title = 'about.md — TextEdit';
      w = 720; h = 600;
    } else if (appId === 'stack') {
      title = 'System / Capabilities';
      w = 760; h = 540;
    } else if (appId === 'photos') {
      title = 'Photos — Adam Crocker';
      w = 540; h = 600;
    } else if (appId === 'mail') {
      title = 'New Message — Mail';
      w = 620; h = 460;
    } else if (appId === 'resume') {
      title = 'Adam_Crocker_Resume.pdf — Preview';
      w = 720; h = 720;
    } else if (appId.indexOf('project:') === 0) {
      var pid = appId.split(':')[1];
      var p = projects.filter(function (pp) { return pp.id === pid; })[0];
      if (!p) return;
      title = p.title + ' — Project';
      w = 660; h = 540;
      content.querySelector('[data-tag]').textContent = p.tag;
      content.querySelector('[data-org]').textContent = p.org;
      content.querySelector('[data-title]').textContent = p.title;
      content.querySelector('[data-desc]').textContent = p.desc;
      var statsEl = content.querySelector('[data-stats]');
      p.stats.forEach(function (s) {
        var d = document.createElement('div');
        d.className = 'proj-stat';
        d.innerHTML = '<div class="proj-stat-n"></div><div class="proj-stat-l"></div>';
        d.querySelector('.proj-stat-n').textContent = s[0];
        d.querySelector('.proj-stat-l').textContent = s[1];
        statsEl.appendChild(d);
      });
      var chipsEl = content.querySelector('[data-chips]');
      p.chips.forEach(function (c) {
        var s = document.createElement('span');
        s.textContent = c;
        chipsEl.appendChild(s);
      });
    }

    // Random offset for multi-instance project windows
    var ox = 100 + Math.random() * 120;
    var oy = 60 + Math.random() * 80;
    if (window.innerWidth < 900) { w = window.innerWidth - 40; h = window.innerHeight - 200; ox = 20; oy = 40; }

    var win = makeWindow({ title: title, content: content, w: w, h: h, x: ox, y: oy, app: appId });
    if (appId.indexOf('project:') !== 0) {
      openWindows[appId] = win;
      var dockEl = $('.dock-app[data-open="' + appId + '"]');
      if (dockEl) dockEl.classList.add('is-open');
    }
    return win;
  }

  // ===== TERMINAL =====
  function setupTerminal(scope) {
    var body = scope.querySelector('[data-term-body]');
    var form = scope.querySelector('[data-term-input]');
    var input = form.querySelector('input');

    function out(html, mute) {
      var d = document.createElement('div');
      d.className = 'term-out' + (mute ? ' term-mute' : '');
      d.innerHTML = html;
      body.appendChild(d);
      requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });
    }
    function echoCmd(cmd) {
      var d = document.createElement('div');
      d.className = 'term-line';
      d.innerHTML = '<span class="term-ps">adam@crockerOS</span> <span class="term-cwd">~</span> <span class="term-mark">%</span> <span class="term-cmd"></span>';
      d.querySelector('.term-cmd').textContent = cmd;
      body.appendChild(d);
    }

    var fs = {
      'about.md': 'Adam Crocker — AI Cloud Engineer · AWS Solutions Architect — Professional.\nBuilding AI-native systems for businesses of every size.\nBased in Springville, Alabama. Remote anywhere.',
      'roles.txt': 'Delta Air Lines — Data Engineer (ODSR) · moving to AI Enablement June 2026\nDiversified Gas & Oil — Systems Engineer · since Aug 2025\nThat Simple Tech — founder · AI-native consultancy',
      'contact.txt': 'email:    crocker.j.adam@gmail.com\nphone:    (205) 276-1071\nlinkedin: linkedin.com/in/adam-crocker1\ngithub:   github.com/captcrock\nbase:     Springville · AL · US'
    };

    var commands = {
      help: function () {
        out(
          '<h3>Commands</h3>' +
          '<div class="term-kv"><span>help</span><span>show this list</span></div>' +
          '<div class="term-kv"><span>whoami</span><span>quick intro</span></div>' +
          '<div class="term-kv"><span>ls</span><span>list files in home dir</span></div>' +
          '<div class="term-kv"><span>cat &lt;file&gt;</span><span>print file contents (about.md, roles.txt, contact.txt)</span></div>' +
          '<div class="term-kv"><span>projects</span><span>show 6 selected projects</span></div>' +
          '<div class="term-kv"><span>open &lt;app&gt;</span><span>finder · about · stack · photos · mail · resume</span></div>' +
          '<div class="term-kv"><span>stack</span><span>show technologies</span></div>' +
          '<div class="term-kv"><span>contact</span><span>show contact info</span></div>' +
          '<div class="term-kv"><span>clear</span><span>clear screen</span></div>'
        );
      },
      whoami: function () {
        out('Adam Crocker · AI Cloud Engineer · AWS Solutions Architect — Professional');
      },
      ls: function () {
        out('about.md   roles.txt   contact.txt   projects/   resume.pdf');
      },
      cat: function (arg) {
        if (!arg) return out('cat: missing operand', true);
        if (fs[arg]) return out(fs[arg].replace(/\n/g, '<br>'));
        out('cat: ' + arg + ': No such file or directory', true);
      },
      projects: function () {
        out(
          '<h3>Selected work</h3>' +
          projects.map(function (p, i) {
            return '<div class="term-kv"><span>' + String(i+1).padStart(2,'0') + '. ' + p.id + '</span><span>' + p.title + ' — <em>' + p.org + '</em></span></div>';
          }).join('') +
          '<br><span class="term-mute">Tip: <code>open projects/&lt;id&gt;</code> to open a project window.</span>'
        );
      },
      stack: function () {
        out(
          '<h3>Stack — six buckets</h3>' +
          '<div class="term-kv"><span>AI / ML</span><span>Claude API · OpenRouter · Bedrock · pgai · vLLM · MiniMax · Qwen · Pipecat · Deepgram</span></div>' +
          '<div class="term-kv"><span>AWS</span><span>Lambda · Step Functions · SageMaker · Bedrock · Glue · CDK · Amplify · AppSync</span></div>' +
          '<div class="term-kv"><span>Data</span><span>TimescaleDB · PostgreSQL · Teradata · Snowflake · pgvector · pgai</span></div>' +
          '<div class="term-kv"><span>App</span><span>FastAPI · SvelteKit 2 · Angular 20 · Ionic 8 · React · Three.js · GSAP</span></div>' +
          '<div class="term-kv"><span>DevOps</span><span>Azure DevOps · GitHub Actions · CDK · CloudFormation · Docker</span></div>' +
          '<div class="term-kv"><span>Lang</span><span>Python · TypeScript · SQL · PL/pgSQL · Bash · PowerShell</span></div>'
        );
      },
      contact: function () {
        out(
          '<h3>Contact</h3>' +
          '<div class="term-kv"><span>email</span><span><a href="mailto:crocker.j.adam@gmail.com">crocker.j.adam@gmail.com</a></span></div>' +
          '<div class="term-kv"><span>phone</span><span>(205) 276-1071</span></div>' +
          '<div class="term-kv"><span>linkedin</span><span><a href="https://linkedin.com/in/adam-crocker1" target="_blank">adam-crocker1</a></span></div>' +
          '<div class="term-kv"><span>github</span><span><a href="https://github.com/captcrock" target="_blank">captcrock</a></span></div>' +
          '<div class="term-kv"><span>base</span><span>Springville · AL · US</span></div>'
        );
      },
      open: function (arg) {
        if (!arg) return out('open: missing operand. usage: open &lt;app&gt;', true);
        var direct = ['finder', 'about', 'stack', 'photos', 'mail', 'resume'];
        if (direct.indexOf(arg) !== -1) { openApp(arg); return out('Opening ' + arg + '…', true); }
        if (arg.indexOf('projects/') === 0) {
          var pid = arg.replace('projects/', '');
          if (projects.some(function (p) { return p.id === pid; })) { openApp('project:' + pid); return out('Opening project: ' + pid, true); }
          return out('open: project not found: ' + pid, true);
        }
        out('open: unknown app: ' + arg, true);
      },
      clear: function () {
        body.innerHTML = '';
      }
    };

    function runCmd(raw) {
      var parts = raw.trim().split(/\s+/);
      var cmd = parts[0];
      var arg = parts.slice(1).join(' ');
      if (!cmd) return;
      echoCmd(raw);
      if (commands[cmd]) commands[cmd](arg);
      else out('command not found: ' + cmd + ' — try <code>help</code>', true);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      runCmd(v);
    });

    // Click in body keeps focus on input
    body.addEventListener('click', function () { input.focus(); });
    setTimeout(function () { input.focus(); }, 100);
  }

  // ===== FINDER =====
  function setupFinder(scope) {
    var grid = scope.querySelector('[data-fnd-grid]');
    projects.forEach(function (p) {
      var b = document.createElement('button');
      b.className = 'fnd-file';
      b.innerHTML =
        '<div class="fnd-file-icon"></div>' +
        '<div class="fnd-file-name">' + p.id + '.proj</div>';
      // Initial of project as icon glyph
      b.querySelector('.fnd-file-icon').textContent = (p.tag.charAt(0));
      b.addEventListener('dblclick', function () { openApp('project:' + p.id); });
      b.addEventListener('click', function () {
        $$('.fnd-file', grid).forEach(function (x) { x.style.background = ''; });
        b.style.background = 'rgba(106,183,255,0.16)';
      });
      grid.appendChild(b);
    });
    // single-click → open after small debounce (simpler than dblclick on touch)
    grid.addEventListener('click', function (e) {
      var f = e.target.closest('.fnd-file');
      if (!f) return;
      // open project on second click within 600ms (or single click on touch)
      if (f._lastClick && Date.now() - f._lastClick < 600) {
        var idx = $$('.fnd-file', grid).indexOf(f);
        if (idx >= 0) openApp('project:' + projects[idx].id);
      }
      f._lastClick = Date.now();
    });
  }

  // ===== ICON + DOCK LAUNCH =====
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { openApp(b.getAttribute('data-open')); });
  });

  // ===== BOOT =====
  runBoot();
})();
