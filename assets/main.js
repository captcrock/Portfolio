/* =========================================================
   Spatial gallery — Adam Crocker
   Three.js scene with floating project monoliths
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // ===== PROJECTS =====
  var projects = [
    { id: 'historian', tag: 'DATA PLATFORM', org: 'Diversified Gas & Oil',
      title: 'Corporate Historian', sub: 'Central OT data warehouse',
      desc: "Lead engineer on the central operational data warehouse. TimescaleDB with 15 schemas, 77 tables, 114 PL/pgSQL functions managing 1.6M+ daily production records. Star-schema with effective-dated dimensions, hypertables, continuous aggregates. ETL from CygNet SCADA, Snowflake, MNR; outbound to Grafana, regulatory reporting, volume control. Embedded pgai for automated issue detection over operator free-text and semantic search across historical observations.",
      stats: [['1.6M+', 'records / day'], ['114', 'pl/pgsql funcs'], ['15 / 77', 'schemas / tables']],
      chips: ['TimescaleDB', 'PL/pgSQL', 'pgai', 'Python', 'CygNet', 'Snowflake'],
      color: 0xb9ff5b },
    { id: 'agency', tag: 'AI SYSTEMS', org: 'That Simple Tech',
      title: 'Autonomous AI Agency', sub: '10-agent client lifecycle platform',
      desc: "10-agent system handling the full client lifecycle — intake, sales, scoping, build, QA, deploy, support, billing, comms, phone — across 8 project types. MiniMax M2.7 primary across roles (100% tool calling, ~3.3× cheaper, ~2.5× faster than the Claude API path); Gemini 3 Flash Preview for visual QA. Voice via Pipecat + Telnyx + Deepgram Nova; agents execute inside Cua sandboxes. SvelteKit client portal on Vercel with unified revision queue.",
      stats: [['10', 'agents'], ['8', 'project types'], ['~15×', 'cost reduction']],
      chips: ['MiniMax M2.7', 'Gemini 3 Flash', 'OpenRouter', 'Qwen Code', 'Pipecat', 'Telnyx', 'Deepgram Nova', 'Cua', 'SvelteKit', 'Stripe'],
      color: 0x5bcdff },
    { id: 'reporting', tag: 'AI AT SCALE', org: 'Delta Air Lines',
      title: 'Reporting Modernization v2', sub: 'SCRD / ESR / MPR',
      desc: "JSON-first replacement for three legacy operational scorecards (SCRD/ESR/MPR) — SCRD alone processing ~2,300 organizational entities per monthly close. Python packagers against Teradata, Step Functions parallel branch, DynamoDB caching, S3-backed registry; renderer collapsed to a single vanilla-JS viewer. AWS Bedrock (Claude Haiku 4.5) for auto-narratives and per-KPI explanations via /api/v1/kpi-explain. Closed seven latent defects en route — including an eval()-based templating injection.",
      stats: [['~2.3k', 'entities/closeout'], ['7', 'defects closed'], ['13', 'engineering docs']],
      chips: ['AWS Bedrock', 'Claude Haiku 4.5', 'Step Functions', 'DynamoDB', 'Glue (Python)', 'Lambda', 'API Gateway', 'S3', 'Teradata'],
      color: 0xff5bd0 },
    { id: 'historian-ml', tag: 'ML PLATFORM', org: 'Diversified Gas & Oil',
      title: 'Historian ML', sub: 'Industrial anomaly detection',
      desc: "ML platform over 186M+ telemetry observations. Pattern-detection engine covering 8 categories of industrial sensor failure. Isolation Forest for unsupervised anomaly detection, Random Forest for pattern classification, LSTM for sensor-level forecasting. Packaged as an AWS CDK stack with a 580-line handoff runbook.",
      stats: [['186M+', 'observations'], ['8', 'failure categories'], ['3', 'model architectures']],
      chips: ['SageMaker', 'CDK', 'Python', 'Isolation Forest', 'LSTM'],
      color: 0xb9ff5b },
    { id: 'cicd', tag: 'DEVOPS', org: 'Diversified Gas & Oil',
      title: 'Hybrid DB Migration CI/CD', sub: '5-stage pipeline · SOX audit',
      desc: "5-stage Azure DevOps pipeline on a self-hosted Windows agent: validates, classifies, approves, executes, documents every schema change. Pattern-based SQL risk classifier (BLOCKED / HIGH / MEDIUM / LOW) over ~30 regex patterns. DROP TABLE foreign-key safeguard. Transactional execution with auto-rollback. SOX-aligned audit logging.",
      stats: [['5', 'stages'], ['~30', 'risk patterns'], ['SOX', 'audit-aligned']],
      chips: ['Azure DevOps', 'PowerShell', 'PostgreSQL', 'git'],
      color: 0x5bcdff },
    { id: 'field', tag: 'MOBILE', org: 'Diversified Gas & Oil',
      title: 'Field App', sub: 'Offline-first tank inspections',
      desc: "Ionic 8 + Angular 20 + Capacitor app replacing paper-based tank inspections. Single codebase deploys as native iOS / Android and installable PWA. Offline-first on Dexie / IndexedDB with a write-queue and conflict-resolving sync. AWS Amplify backend with AppSync GraphQL, DynamoDB, Cognito brokered with Azure AD via MSAL.",
      stats: [['3', 'targets, 1 codebase'], ['Offline', 'first'], ['SSO', 'Cognito ↔ Azure AD']],
      chips: ['Ionic 8', 'Angular 20', 'Capacitor', 'Dexie', 'AppSync', 'Cognito'],
      color: 0xff5bd0 }
  ];

  // ===== LOADING =====
  var loadingEl = $('#loading');
  var loadingFill = $('.loading-fill');
  var loadingStatus = $('#loading-status');
  var loadingSteps = [
    ['Loading geometry…', 25],
    ['Building monoliths…', 55],
    ['Igniting starfield…', 80],
    ['Calibrating camera…', 100]
  ];
  function runLoading(onDone) {
    var i = 0;
    function step() {
      var s = loadingSteps[i];
      loadingStatus.textContent = s[0];
      loadingFill.style.width = s[1] + '%';
      i++;
      if (i < loadingSteps.length) setTimeout(step, 280);
      else setTimeout(function () { loadingEl.classList.add('is-done'); onDone(); }, 420);
    }
    step();
  }

  // ===== THREE.JS SCENE =====
  var canvas = $('#canvas');
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06060c, 0.013);

  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x06060c, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // ===== LIGHTS =====
  scene.add(new THREE.AmbientLight(0x303040, 1.0));
  var key = new THREE.DirectionalLight(0xb9ff5b, 0.6);
  key.position.set(8, 12, 6);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x5bcdff, 0.5);
  fill.position.set(-10, 4, -6);
  scene.add(fill);
  var rim = new THREE.DirectionalLight(0xff5bd0, 0.35);
  rim.position.set(0, -6, -10);
  scene.add(rim);

  // ===== STARFIELD =====
  function makeStarfield(count, spread, size) {
    var g = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var r = spread * (0.4 + Math.random() * 0.6);
      var t = Math.random() * Math.PI * 2;
      var p = Math.acos(2 * Math.random() - 1);
      positions[i*3]   = r * Math.sin(p) * Math.cos(t);
      positions[i*3+1] = r * Math.sin(p) * Math.sin(t);
      positions[i*3+2] = r * Math.cos(p);
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var m = new THREE.PointsMaterial({ color: 0xf0eee8, size: size, sizeAttenuation: true, transparent: true, opacity: 0.85 });
    return new THREE.Points(g, m);
  }
  var stars = makeStarfield(2400, 80, 0.10);
  scene.add(stars);
  var dust = makeStarfield(900, 22, 0.035);
  dust.material.color = new THREE.Color(0xb9ff5b);
  dust.material.opacity = 0.55;
  scene.add(dust);

  // ===== CENTER ORB =====
  var orbGroup = new THREE.Group();
  scene.add(orbGroup);

  var orbCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0a0a14, emissive: 0xb9ff5b, emissiveIntensity: 0.5,
      metalness: 0.6, roughness: 0.4
    })
  );
  orbGroup.add(orbCore);

  var orbWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 1),
    new THREE.MeshBasicMaterial({ color: 0xb9ff5b, wireframe: true, transparent: true, opacity: 0.4 })
  );
  orbGroup.add(orbWire);

  var orbHalo = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xb9ff5b, transparent: true, opacity: 0.05, side: THREE.BackSide })
  );
  orbGroup.add(orbHalo);

  // ===== MONOLITHS =====
  var monoliths = [];
  var ringRadius = 7.5;

  projects.forEach(function (p, i) {
    var angle = (i / projects.length) * Math.PI * 2;
    var height = 3.2 + (i % 3) * 0.6; // staggered heights
    var width = 1.4, depth = 0.4;

    // Core monolith
    var core = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({
        color: 0x0d0d18,
        emissive: p.color,
        emissiveIntensity: 0.10,
        metalness: 0.75,
        roughness: 0.35
      })
    );

    // Glow edge — slightly larger wireframe overlay
    var edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(core.geometry),
      new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.75 })
    );

    // Floor halo plate beneath
    var plate = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 32),
      new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.10, side: THREE.DoubleSide })
    );
    plate.rotation.x = -Math.PI / 2;
    plate.position.y = -height / 2 - 0.01;

    var group = new THREE.Group();
    group.add(core);
    group.add(edge);
    group.add(plate);

    group.position.set(
      Math.cos(angle) * ringRadius,
      Math.sin(i * 1.7) * 0.4, // gentle vertical wobble baseline
      Math.sin(angle) * ringRadius
    );
    group.lookAt(0, group.position.y, 0);

    // Store the index on the core for raycast hit-detection
    core.userData.projectIndex = i;
    group.userData = { index: i, baseY: group.position.y, angle: angle, project: p };

    scene.add(group);
    monoliths.push({ group: group, core: core, edge: edge, plate: plate, project: p });
  });

  // ===== CAMERA RIG (custom orbit) =====
  var camTarget = new THREE.Vector3(0, 0, 0);
  var camSph = { radius: 16, theta: Math.PI * 0.25, phi: Math.PI * 0.42 };
  var camSphTarget = { radius: 16, theta: Math.PI * 0.25, phi: Math.PI * 0.42 };
  var defaults = { radius: 16, theta: Math.PI * 0.25, phi: Math.PI * 0.42 };

  function applyCam() {
    var s = Math.sin(camSph.phi);
    camera.position.x = camTarget.x + camSph.radius * s * Math.cos(camSph.theta);
    camera.position.y = camTarget.y + camSph.radius * Math.cos(camSph.phi);
    camera.position.z = camTarget.z + camSph.radius * s * Math.sin(camSph.theta);
    camera.lookAt(camTarget);
  }
  applyCam();

  // ===== INTERACTIONS =====
  var dragging = false, dragMoved = false;
  var lastX = 0, lastY = 0;

  function onDown(x, y) {
    dragging = true; dragMoved = false;
    lastX = x; lastY = y;
    document.body.classList.add('is-dragging');
  }
  function onMove(x, y) {
    if (!dragging) return;
    var dx = x - lastX, dy = y - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
    camSphTarget.theta -= dx * 0.005;
    camSphTarget.phi   -= dy * 0.005;
    camSphTarget.phi = Math.max(0.15, Math.min(Math.PI - 0.15, camSphTarget.phi));
    lastX = x; lastY = y;
  }
  function onUp() {
    dragging = false;
    document.body.classList.remove('is-dragging');
  }

  canvas.addEventListener('mousedown', function (e) { onDown(e.clientX, e.clientY); });
  window.addEventListener('mousemove', function (e) { onMove(e.clientX, e.clientY); });
  window.addEventListener('mouseup', onUp);

  canvas.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; onDown(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    var t = e.touches[0]; if (t) onMove(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', onUp);

  // Scroll → zoom
  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();
    camSphTarget.radius += e.deltaY * 0.015;
    camSphTarget.radius = Math.max(5.5, Math.min(28, camSphTarget.radius));
  }, { passive: false });

  // Raycaster
  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var hoveredIdx = -1;

  var hoverCard = $('#hover-card');
  var hcNum = hoverCard.querySelector('.hc-num');
  var hcTitle = hoverCard.querySelector('.hc-title');

  canvas.addEventListener('mousemove', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    hoverCard.style.left = e.clientX + 'px';
    hoverCard.style.top = e.clientY + 'px';
  });
  canvas.addEventListener('mouseleave', function () {
    hoveredIdx = -1;
    hoverCard.classList.remove('is-on');
    document.body.classList.remove('is-hovering');
  });

  canvas.addEventListener('click', function (e) {
    if (dragMoved) return; // ignore clicks that were drags
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    var hit = pickMonolith();
    if (hit !== -1) openProject(hit);
  });

  function pickMonolith() {
    raycaster.setFromCamera(pointer, camera);
    var cores = monoliths.map(function (m) { return m.core; });
    var hits = raycaster.intersectObjects(cores, false);
    if (hits.length === 0) return -1;
    return hits[0].object.userData.projectIndex;
  }

  // ===== PROJECT MODAL =====
  var modal = $('#modal');
  var modalClose = $('#modal-close');
  function openProject(idx) {
    var p = projects[idx];
    modal.querySelector('.modal-num').textContent = 'PROJECT ' + String(idx + 1).padStart(2, '0') + ' / ' + String(projects.length).padStart(2, '0');
    modal.querySelector('.modal-tag').textContent = p.tag;
    modal.querySelector('.modal-org').textContent = p.org;
    modal.querySelector('.modal-title').textContent = p.title;
    modal.querySelector('.modal-sub').textContent = p.sub;
    modal.querySelector('.modal-desc').textContent = p.desc;

    var statsEl = modal.querySelector('.modal-stats');
    statsEl.innerHTML = '';
    p.stats.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'modal-stat';
      d.innerHTML = '<div class="modal-stat-n"></div><div class="modal-stat-l"></div>';
      d.querySelector('.modal-stat-n').textContent = s[0];
      d.querySelector('.modal-stat-l').textContent = s[1];
      statsEl.appendChild(d);
    });

    var chipsEl = modal.querySelector('.modal-chips');
    chipsEl.innerHTML = '';
    p.chips.forEach(function (c) {
      var s = document.createElement('span');
      s.textContent = c;
      chipsEl.appendChild(s);
    });

    // Tint modal accents to the project's color
    var hex = '#' + p.color.toString(16).padStart(6, '0');
    modal.querySelector('.modal-num').style.color = hex;
    modal.querySelector('.modal-tag').style.color = hex;
    modal.querySelector('.modal-sub').style.color = hex;

    modal.classList.add('is-on');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.classList.remove('is-on');
    modal.setAttribute('aria-hidden', 'true');
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); $('#contact-fab').classList.remove('is-open'); }
  });

  // ===== HUD ACTIONS =====
  $('#btn-reset').addEventListener('click', function () {
    camSphTarget.radius = defaults.radius;
    camSphTarget.theta = defaults.theta;
    camSphTarget.phi = defaults.phi;
  });

  $('#cf-toggle').addEventListener('click', function (e) {
    e.stopPropagation();
    $('#contact-fab').classList.toggle('is-open');
  });
  document.addEventListener('click', function (e) {
    var fab = $('#contact-fab');
    if (fab.classList.contains('is-open') && !fab.contains(e.target)) {
      fab.classList.remove('is-open');
    }
  });

  // ===== COORDS =====
  var coordsEl = $('#hud-coords-val');
  function updateCoords() {
    coordsEl.textContent =
      'x: ' + camera.position.x.toFixed(2) +
      '  y: ' + camera.position.y.toFixed(2) +
      '  z: ' + camera.position.z.toFixed(2);
  }

  // ===== RESIZE =====
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ===== ANIMATION LOOP =====
  var clock = new THREE.Clock();
  function animate() {
    var t = clock.getElapsedTime();
    var dt = Math.min(clock.getDelta(), 0.05);

    // Ease camera spherical coords toward target
    camSph.radius += (camSphTarget.radius - camSph.radius) * 0.08;
    camSph.theta += (camSphTarget.theta - camSph.theta) * 0.10;
    camSph.phi   += (camSphTarget.phi - camSph.phi) * 0.10;
    applyCam();

    // Float monoliths gently + slow self-rotation
    monoliths.forEach(function (m, i) {
      m.group.position.y = m.group.userData.baseY + Math.sin(t * 0.6 + i * 1.3) * 0.18;
      m.group.rotation.y = t * 0.06 + i * 0.3;
      m.edge.material.opacity = 0.55 + Math.sin(t * 1.2 + i) * 0.20;
    });

    // Orb pulse
    orbGroup.rotation.y = t * 0.20;
    orbGroup.rotation.x = Math.sin(t * 0.3) * 0.15;
    orbCore.material.emissiveIntensity = 0.45 + Math.sin(t * 1.6) * 0.20;
    orbHalo.material.opacity = 0.05 + Math.sin(t * 1.4) * 0.03;

    // Starfield slow rotation
    stars.rotation.y = t * 0.005;
    dust.rotation.y = -t * 0.012;

    // Raycast for hover
    if (!dragging) {
      raycaster.setFromCamera(pointer, camera);
      var cores = monoliths.map(function (m) { return m.core; });
      var hits = raycaster.intersectObjects(cores, false);
      var idx = hits.length > 0 ? hits[0].object.userData.projectIndex : -1;
      if (idx !== hoveredIdx) {
        hoveredIdx = idx;
        if (idx === -1) {
          hoverCard.classList.remove('is-on');
          document.body.classList.remove('is-hovering');
          monoliths.forEach(function (m) { m.core.material.emissiveIntensity = 0.10; });
        } else {
          var p = projects[idx];
          hcNum.textContent = String(idx + 1).padStart(2, '0');
          hcTitle.textContent = p.title;
          hoverCard.style.borderColor = '#' + p.color.toString(16).padStart(6, '0');
          hcNum.style.color = '#' + p.color.toString(16).padStart(6, '0');
          hoverCard.classList.add('is-on');
          document.body.classList.add('is-hovering');
          monoliths.forEach(function (m, i) {
            m.core.material.emissiveIntensity = i === idx ? 0.50 : 0.10;
          });
        }
      }
    }

    updateCoords();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // ===== KICK OFF =====
  runLoading(function () {
    animate();
  });
})();
