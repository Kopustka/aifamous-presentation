/**
 * Famous Generation Background Widget
 * Инжектируется на все страницы; хранит состояние в sessionStorage.
 * API: window.famousSetActiveGen(data), window.famousClearActiveGen()
 */
(function () {
  'use strict';

  var STORAGE_KEY    = 'famous_active_gen';
  var POLL_MS        = 2000;
  var HIDE_DELAY     = 5000;

  var VIDEO_STAGES = [
    {id:'INITIALIZING',        icon:'\u26A1'},
    {id:'UPLOADING REFERENCE', icon:'\u2B06'},
    {id:'QUEUING COMFYUI',     icon:'\u23F3'},
    {id:'GENERATING VIDEO',    icon:'\uD83E\uDDE0'},
    {id:'DOWNLOADING',         icon:'\u2B07'},
    {id:'FINALIZING',          icon:'\u2705'},
  ];

  var MODEL_STAGES = [
    {id:'INITIALIZING',     icon:'\u26A1'},
    {id:'UPLOADING PHOTOS', icon:'\u2B06'},
    {id:'GENERATING IMAGE', icon:'\uD83C\uDFA8'},
    {id:'GENERATING BIO',   icon:'\u270D'},
    {id:'SAVING MODEL',     icon:'\uD83D\uDCBE'},
    {id:'FINALIZING',       icon:'\u2705'},
  ];

  var WIDGET_STAGES = VIDEO_STAGES; // default, overridden per gen type

  var STAGE_DESCS = {
    'INITIALIZING':        'Инициализация...',
    'UPLOADING REFERENCE': 'Выгрузка файлов',
    'QUEUING COMFYUI':     'Ожидание в очереди',
    'GENERATING VIDEO':    'Генерация кадров',
    'DOWNLOADING':         'Скачивание видео',
    'UPLOADING PHOTOS':    'Загрузка фото',
    'GENERATING IMAGE':    'Генерация изображения',
    'GENERATING BIO':      'Создание биографии',
    'SAVING MODEL':        'Сохранение модели',
    'FINALIZING':          'Финализация',
  };

  var _pollTimer  = null;
  var _tickTimer  = null;
  var _startTime  = 0;
  var _lastPct    = 0;
  var _genData    = null;

  /* ── Storage ───────────────────────────────────────────────────── */
  function save(d)  { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch(e){} }
  function load()   { try { var s=sessionStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):null; } catch(e){ return null; } }
  function clear()  { try { sessionStorage.removeItem(STORAGE_KEY); } catch(e){} }

  /* ── Helpers ───────────────────────────────────────────────────── */
  function tgInit() {
    return (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) || '';
  }
  function fmtTimer(ms) {
    var sec = Math.floor(ms / 1000);
    var m   = Math.floor(sec / 60);
    var s   = (sec % 60).toString().padStart(2, '0');
    return m + ':' + s;
  }
  function el(id) { return document.getElementById(id); }

  /* ── DOM creation ─────────────────────────────────────────────── */
  function buildDOM() {
    if (el('famous-widget-root')) return;

    var root = document.createElement('div');
    root.id  = 'famous-widget-root';

    // Build mini stepper HTML
    var stepperHtml = '';
    for (var i = 0; i < WIDGET_STAGES.length; i++) {
      stepperHtml +=
        '<div class="famous-step pending" data-stage-idx="' + i + '">' +
          '<div class="famous-step-box">' + WIDGET_STAGES[i].icon + '</div>' +
          '<div class="famous-step-line"></div>' +
        '</div>';
    }

    root.innerHTML =
      '<div id="famous-widget-arrow">&#9650;</div>' +
      '<div id="famous-widget-card">' +
        '<div class="famous-card-row1">' +
          '<img id="famous-widget-avatar" class="famous-avatar" src="" alt="">' +
          '<div class="famous-card-info" id="famous-card-info">' +
            '<div id="famous-widget-name" class="famous-name">—</div>' +
            '<div id="famous-widget-type" class="famous-type">—</div>' +
          '</div>' +
          '<button class="famous-close-btn" id="famous-widget-close" title="Свернуть">×</button>' +
        '</div>' +
        '<div class="famous-stepper" id="famous-stepper">' + stepperHtml + '</div>' +
        '<div class="famous-stage-desc" id="famous-stage-desc">—</div>' +
        '<div class="famous-card-row2">' +
          '<span id="famous-widget-stage" class="famous-stage"></span>' +
          '<span id="famous-widget-ptimer" class="famous-ptimer">0% • 0:00</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    el('famous-widget-close').addEventListener('click', function(e) {
      e.stopPropagation();
      showArrow();
    });

    el('famous-widget-arrow').addEventListener('click', function() {
      showCard();
    });
  }

  /* ── Visibility helpers ────────────────────────────────────────── */
  function showCard() {
    var root  = el('famous-widget-root');
    var arrow = el('famous-widget-arrow');
    var card  = el('famous-widget-card');
    if (!root) return;
    root.style.display  = 'block';
    if (arrow) arrow.style.display = 'none';
    if (card)  card.style.display  = 'block';
  }
  function showArrow() {
    var root  = el('famous-widget-root');
    var arrow = el('famous-widget-arrow');
    var card  = el('famous-widget-card');
    if (!root) return;
    root.style.display  = 'block';
    if (arrow) arrow.style.display = 'flex';
    if (card)  card.style.display  = 'none';
  }
  function hideWidget() {
    var root = el('famous-widget-root');
    if (root) root.style.display = 'none';
  }

  /* ── UI update ─────────────────────────────────────────────────── */
  function setImg(imgEl, src) {
    if (!imgEl) return;
    imgEl.src = src || '';
    imgEl.onerror = function() { imgEl.src = 'assets/Sara 3.jpeg'; };
  }
  function applyData(d) {
    var imgSrc = d.model_preview_url || 'assets/Sara 3.jpeg';
    setImg(el('famous-widget-avatar'), imgSrc);
    var nameEl = el('famous-widget-name');
    var typeEl = el('famous-widget-type');
    if (nameEl) nameEl.textContent = (d.model_name || 'Generation').toUpperCase();
    if (typeEl) typeEl.textContent = (d.type_label || d.type || '').toUpperCase().replace('_', ' ');

    var info = el('famous-card-info');
    if (info) {
      info.style.cursor = 'pointer';
      info.onclick = function() {
        if (d.type === 'video')       location.href = 'create_video.html';
        else if (d.type === 'model')  location.href = 'create_model.html';
      };
    }
  }

  function updateStepper(stage, status) {
    var stepper = el('famous-stepper');
    if (!stepper) return;
    var steps = stepper.querySelectorAll('.famous-step');
    var curIdx = -1;
    for (var i = 0; i < WIDGET_STAGES.length; i++) {
      if (WIDGET_STAGES[i].id === stage) { curIdx = i; break; }
    }

    for (var j = 0; j < steps.length; j++) {
      steps[j].className = 'famous-step';
      var box = steps[j].querySelector('.famous-step-box');
      if (status === 'error' && j <= curIdx) {
        steps[j].className += ' error';
      } else if (status === 'success' || j < curIdx) {
        steps[j].className += ' done';
        if (box) box.textContent = '\u2713';
      } else if (j === curIdx) {
        steps[j].className += ' active';
        if (box) box.textContent = WIDGET_STAGES[j].icon;
      } else {
        steps[j].className += ' pending';
        if (box) box.textContent = WIDGET_STAGES[j].icon;
      }
    }

    // Update description
    var descEl = el('famous-stage-desc');
    if (descEl) {
      if (status === 'success') {
        descEl.textContent = '✅ Готово';
        descEl.style.color = '#3dff6e';
      } else if (status === 'error') {
        descEl.textContent = '❌ Ошибка';
        descEl.style.color = '#ff4444';
      } else {
        descEl.textContent = STAGE_DESCS[stage] || stage || '—';
        descEl.style.color = '#3dff6e';
      }
    }
  }

  function updateProgress(pct, stage) {
    var stEl   = el('famous-widget-stage');
    var ptEl   = el('famous-widget-ptimer');
    _lastPct   = pct;
    if (stEl)  stEl.textContent  = pct + '%';
    if (ptEl)  ptEl.textContent  = pct + '% • ' + fmtTimer(Date.now() - _startTime);
    updateStepper(stage, null);
  }

  /* ── Tick (1 sec timer refresh) ────────────────────────────────── */
  function startTick() {
    clearInterval(_tickTimer);
    _tickTimer = setInterval(function() {
      var ptEl = el('famous-widget-ptimer');
      if (ptEl) ptEl.textContent = _lastPct + '% • ' + fmtTimer(Date.now() - _startTime);
    }, 1000);
  }

  /* ── Polling ───────────────────────────────────────────────────── */
  function startPoll(genId) {
    clearInterval(_pollTimer);
    _pollTimer = setInterval(function() { doPoll(genId); }, POLL_MS);
  }
  function stopPoll() {
    clearInterval(_pollTimer);
    clearInterval(_tickTimer);
    _pollTimer = null;
    _tickTimer = null;
  }
  function doPoll(genId) {
    fetch('/api/generation/' + genId + '/detailed-status', {
      headers: { 'X-Telegram-Init-Data': tgInit() }
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var stage = d.current_stage || 'INITIALIZING';
      var pct   = d.stage_progress || 0;
      _lastPct  = pct;
      updateStepper(stage, d.status);

      var stEl = el('famous-widget-stage');
      var ptEl = el('famous-widget-ptimer');
      if (stEl) stEl.textContent = pct + '%';
      if (ptEl) ptEl.textContent = pct + '% • ' + fmtTimer(Date.now() - _startTime);

      if (d.status === 'success') {
        stopPoll();
        updateStepper(stage, 'success');
        // If a model-creation ran in background, tell main.html to refetch.
        if (_genData && _genData.type === 'model') {
          try { sessionStorage.setItem('famous_models_dirty', '1'); } catch (e) {}
        }
        clear();
        setTimeout(hideWidget, HIDE_DELAY);

      } else if (d.status === 'error') {
        stopPoll();
        updateStepper(stage, 'error');
        clear();
        setTimeout(hideWidget, HIDE_DELAY);
      }
    })
    .catch(function() {});
  }

  /* ── Public: start widget with generation data ─────────────────── */
  function startWidget(d) {
    _genData   = d;
    _startTime = d.start_time || Date.now();
    _lastPct   = 0;

    WIDGET_STAGES = (d.type === 'model') ? MODEL_STAGES : VIDEO_STAGES;

    // Сохраняем состояние, чтобы баннер в /all_videos?tab=models мог его прочитать
    save(Object.assign({}, d, { start_time: _startTime }));

    // Для модельных генераций виджет не показываем — статус видно
    // через баннер в разделе Models. Поллинг тоже не нужен — баннер
    // сам опрашивает API при заходе на страницу.
    if (d.type === 'model') return;

    buildDOM();
    applyData(d);
    updateProgress(0, 'INITIALIZING');
    showCard();
    startTick();
    startPoll(d.gen_id);
  }

  /* ── Public API ─────────────────────────────────────────────────── */
  window.famousSetActiveGen = function(d) { startWidget(d); };
  window.famousClearActiveGen = function() {
    stopPoll();
    clear();
    hideWidget();
  };

  /* ── Auto-init from sessionStorage ─────────────────────────────── */
  function init() {
    var saved = load();
    if (!saved || !saved.gen_id) return;
    // Для моделей виджет не строим — баннер в Models делает свою работу.
    if (saved.type === 'model') return;
    buildDOM();
    _genData   = saved;
    _startTime = saved.start_time || Date.now();
    WIDGET_STAGES = VIDEO_STAGES;
    applyData(saved);
    updateProgress(0, 'INITIALIZING');
    showCard();
    startTick();
    startPoll(saved.gen_id);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
