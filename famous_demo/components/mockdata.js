/* ════════════════════════════════════════════════════════════════════
   FAMOUS MOCK DATA — для презентации
   Заменяет все fetch() вызовы на статичные данные.
   Подключается в <head> ПЕРЕД остальными скриптами.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // ─── МОДЕЛИ (Alisa first for s7 demo, Alexa main) ───
  var MODELS = [
    {
      id: 'm0',
      name: 'Alisa',
      bio: 'High-fashion editorial aesthetic. LoRA-enhanced for maximum likeness.',
      preview_url: 'assets/nova_model.jpg',
      created_at: '2026-05-01 10:00:00',
      has_lora: true,
      is_public: true,
      can_manage: true,
      role: 'owner',
      tagline: 'LoRA ready · editorial',
      stats: { views: 312500, likes: 24100, generated: 68 }
    },
    {
      id: 'm1',
      name: 'Alexa',
      bio: 'Dreamy soft-punk into film photography. Loves late-night drives with the music on.',
      preview_url: 'assets/red_hair_girl.png',
      created_at: '2026-04-12 14:23:00',
      has_lora: true,
      is_public: true,
      can_manage: true,
      role: 'owner',
      tagline: 'soft-punk dream from Austin',
      stats: { views: 184230, likes: 12847, generated: 47 }
    },
    {
      id: 'm2',
      name: 'Yuki',
      bio: 'Minimalist from Tokyo. Writes short poems and photographs the fog.',
      preview_url: 'assets/asianblackhairgirl.jfif',
      created_at: '2026-04-08 11:10:00',
      has_lora: true,
      is_public: true,
      stats: { views: 92400, likes: 7210, generated: 31 }
    },
    {
      id: 'm3',
      name: 'Chloe',
      bio: 'California surfer with a sociology degree. Morning coffee on the pier.',
      preview_url: 'assets/blondblueseysgirl.jfif',
      created_at: '2026-03-28 09:45:00',
      has_lora: false,
      is_public: false,
      stats: { views: 64100, likes: 4830, generated: 24 }
    },
    {
      id: 'm4',
      name: 'Mia',
      bio: 'Brooklyn illustrator. Sketches on the subway between café shifts.',
      preview_url: 'assets/defoltgirl.jfif',
      created_at: '2026-03-15 17:30:00',
      has_lora: false,
      is_public: true,
      stats: { views: 38700, likes: 2940, generated: 18 }
    },
    {
      id: 'm5',
      name: 'Sofia',
      bio: 'Dancer from Mexico City. Salsa on Wednesdays, bachata on Fridays.',
      preview_url: 'assets/girlmodelmexico.png',
      created_at: '2026-02-20 12:00:00',
      has_lora: false,
      is_public: true,
      stats: { views: 27500, likes: 2110, generated: 14 }
    }
  ];

  // ─── ВИДЕО (используем все mp4 файлы) ───
  var VIDEOS = [
    { id: 'v1', mode: 'face_swap',  prompt: 'soft evening light, slow movements, warm film grain',
      video_url: 'assets/dark_feminine_makeup.mp4', model_id: 'm1', model_name: 'Alexa',
      model_preview_url: 'assets/red_hair_girl.png', finished_at: '2026-04-25 18:42:00',
      is_public: true, likes: 1247 },
    { id: 'v2', mode: 'face_cloth', prompt: 'summer festival, motion in the crowd',
      video_url: 'assets/Schönstes_Set_von.mp4', model_id: 'm1', model_name: 'Alexa',
      model_preview_url: 'assets/red_hair_girl.png', finished_at: '2026-04-25 16:12:00',
      is_public: true, likes: 894 },
    { id: 'v3', mode: 'face_swap',  prompt: 'studio portrait with cool lighting',
      video_url: 'assets/They_call_me_Sonic.mp4', model_id: 'm2', model_name: 'Yuki',
      model_preview_url: 'assets/asianblackhairgirl.jfif', finished_at: '2026-04-24 22:01:00',
      is_public: true, likes: 632 },
    { id: 'v4', mode: 'face_swap',  prompt: 'neon street at night, rain',
      video_url: 'assets/angelslullaby777_-_7572281412087319828.mp4', model_id: 'm2', model_name: 'Yuki',
      model_preview_url: 'assets/asianblackhairgirl.jfif', finished_at: '2026-04-24 14:30:00',
      is_public: true, likes: 451 },
    { id: 'v5', mode: 'face_cloth', prompt: 'minimalism, white studio backdrop',
      video_url: 'assets/angelslullaby777_-_7616762577107963156.mp4', model_id: 'm3', model_name: 'Chloe',
      model_preview_url: 'assets/blondblueseysgirl.jfif', finished_at: '2026-04-23 11:20:00',
      is_public: false, likes: 0 },
    { id: 'v6', mode: 'face_swap',  prompt: 'sunset beach, warm tones, wind',
      video_url: 'assets/kcatie_23_-_7606765136195636483.mp4', model_id: 'm3', model_name: 'Chloe',
      model_preview_url: 'assets/blondblueseysgirl.jfif', finished_at: '2026-04-22 19:45:00',
      is_public: true, likes: 318 },
    { id: 'v7', mode: 'face_cloth', prompt: 'city rooftop, blue hour',
      video_url: 'assets/kcatie_23_-_7609389006681410838.mp4', model_id: 'm4', model_name: 'Mia',
      model_preview_url: 'assets/defoltgirl.jfif', finished_at: '2026-04-21 16:00:00',
      is_public: true, likes: 207 },
    { id: 'v8', mode: 'face_swap',  prompt: 'dancing in the rain, slow motion',
      video_url: 'assets/bad_girrlllll.mp4', model_id: 'm5', model_name: 'Sofia',
      model_preview_url: 'assets/girlmodelmexico.png', finished_at: '2026-04-20 13:15:00',
      is_public: true, likes: 156 },
    { id: 'v9', mode: 'prompt',     prompt: 'studio shot against neon backlight',
      video_url: 'assets/IMG_0085.MOV', model_id: 'm1', model_name: 'Alexa',
      model_preview_url: 'assets/red_hair_girl.png', finished_at: '2026-04-19 21:00:00',
      is_public: true, likes: 89 },
    { id: 'v10', mode: 'face_swap', prompt: 'morning light, coffee, film grain',
      video_url: 'assets/IMG_0086.MOV', model_id: 'm1', model_name: 'Alexa',
      model_preview_url: 'assets/red_hair_girl.png', finished_at: '2026-04-19 09:30:00',
      is_public: true, likes: 142 }
  ];

  // ─── ПРОФИЛЬ ───
  var PROFILE = {
    id: 123456789,
    user_id: 123456789,
    first_name: 'harchevnikov',
    last_name: '',
    username: 'realnipacan',
    photo_url: 'assets/hq720.jpg',
    plan: 'advancer',
    plan_name: 'Advancer',
    plan_expires_at: '2026-05-26 00:00:00',
    tokens_balance: 8200,
    tokens_spent_today: 35,
    gen_success: 134,
    gen_error: 4,
    models_count: 5,
    pending_invites: 2,
    pending_collab_invites: 2,
    created_at: '2026-02-14 10:20:00'
  };

  // ─── ПОДПИСКА ───
  var SUBSCRIPTION = {
    current: {
      plan: 'advancer',
      plan_name: 'Advancer',
      tokens_balance: 8200,
      plan_expires_at: '2026-05-26 00:00:00',
      video_gen_cost_base: 30,
      video_gen_cost_hd: 60,
      video_gen_cost: 30,
      hd_quality_threshold: 720,
      model_create_cost: 200,
      can_buy_tokens: true,
      max_duration_sec: 15,
      allowed_quality: ['480', '720']
    },
    config: {
      plan_period_days: 30,
      invite_bonus_tokens: 25,
      plans: [
        { id: 'free',     name: 'Free',     tagline: 'Start exploring',
          price_rub: 0,    tokens_grant: 100,
          features: ['100 tokens / month', '480p · up to 5 sec', 'Base models'] },
        { id: 'beginner', name: 'Beginner', tagline: 'For regular creators',
          price_rub: 990,  tokens_grant: 900,
          features: ['900 tokens / month', '720p · up to 10 sec', 'Priority queue'] },
        { id: 'advancer', name: 'Advancer', tagline: 'For pro creators',
          price_rub: 2990, tokens_grant: 2700,
          features: ['2 700 tokens / month', '720p · up to 15 sec', 'Top up tokens any time', 'Priority queue'] }
      ],
      token_packs: [
        { id: 'pack_300',  tokens: 300,  price_rub: 299,  label: 'Casual',        highlight: false },
        { id: 'pack_1000', tokens: 1000, price_rub: 890,  label: 'Most popular',  highlight: true  },
        { id: 'pack_3000', tokens: 3000, price_rub: 2390, label: 'Pro pack',      highlight: false }
      ]
    }
  };

  // ─── ИСТОРИЯ ТОКЕНОВ ───
  var TOKENS_HISTORY = [
    { reason: 'video_gen_hd',  amount: -60,   balance_after: 8200, ref_id: 'Alexa · 720p',          created_at: '2026-04-25 18:42:00' },
    { reason: 'video_gen',     amount: -30,   balance_after: 8260, ref_id: 'Yuki · 480p',           created_at: '2026-04-25 16:12:00' },
    { reason: 'plan_grant',    amount: 2700,  balance_after: 8290, ref_id: 'advancer',              created_at: '2026-04-25 00:00:00' },
    { reason: 'video_gen_hd',  amount: -60,   balance_after: 5590, ref_id: 'Chloe · 720p',          created_at: '2026-04-24 22:01:00' },
    { reason: 'invite_bonus',  amount: 25,    balance_after: 5650, ref_id: '@chloe_dir',            created_at: '2026-04-24 14:00:00' }
  ];

  // ─── ПРИГЛАШЕНИЯ ───
  var INVITE_STATS = {
    invite_link: 'https://t.me/aifamouscenter_bot?start=ref_123456789',
    invited_count: 3,
    tokens_earned: 75,
    bonus_per_invite: 25,
    invitees: [
      { user_id: 1001, name: 'Sasha K.',  joined_at: '2026-04-22 12:00:00' },
      { user_id: 1002, name: 'Marina L.', joined_at: '2026-04-19 18:30:00' },
      { user_id: 1003, name: 'Daniel P.', joined_at: '2026-04-15 09:15:00' }
    ]
  };

  // ─── КОЛЛАБОРАТОРЫ ДЛЯ МОДЕЛЕЙ ───
  var COLLABORATORS_BY_MODEL = {
    'm1': [
      { user_id: 2001, username: 'mia_creates',  name: 'Mia Creates',  status: 'active',  added_at: '2026-04-10' },
      { user_id: 2002, username: 'yuki_films',   name: 'Yuki Films',   status: 'active',  added_at: '2026-04-12' },
      { user_id: 2003, username: 'chloe_dir',    name: 'Chloe Dir',    status: 'pending', added_at: '2026-04-25' }
    ],
    'm2': [
      { user_id: 2004, username: 'leo_studio', name: 'Leo Studio', status: 'active', added_at: '2026-04-15' }
    ],
    'm3': [], 'm4': [], 'm5': []
  };

  // ─── PUBLIC SETTINGS ───
  var PUBLIC_SETTINGS_BY_MODEL = {
    'm1': { show_bio: true,  show_created_at: true,  show_videos: true,  show_lora_badge: true,  tagline: 'soft-punk dream from Austin' },
    'm2': { show_bio: true,  show_created_at: false, show_videos: true,  show_lora_badge: true,  tagline: 'Tokyo minimalism' },
    'm3': { show_bio: false, show_created_at: true,  show_videos: true,  show_lora_badge: false, tagline: '' },
    'm4': { show_bio: true,  show_created_at: true,  show_videos: true,  show_lora_badge: false, tagline: '' },
    'm5': { show_bio: true,  show_created_at: true,  show_videos: false, show_lora_badge: false, tagline: '' }
  };

  // ─── ROUTER fetch() → mock ─────────────────────────────────────
  var origFetch = window.fetch;

  function jsonResp(data, status) {
    return Promise.resolve(new Response(
      JSON.stringify(data),
      { status: status || 200, headers: { 'Content-Type': 'application/json' } }
    ));
  }
  function okResp(extra) {
    return jsonResp(Object.assign({ ok: true }, extra || {}));
  }

  function getQueryParam(url, key) {
    try {
      var m = url.match(new RegExp('[?&]' + key + '=([^&]+)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  window.fetch = function(input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';

    // Только подменяем /api/* — всё остальное идёт в оригинальный fetch
    if (url.indexOf('/api/') === -1) {
      return origFetch(input, init);
    }

    // ─── Профиль ───
    if (url.indexOf('/api/profile') !== -1) return jsonResp(PROFILE);

    // ─── Список моделей ───
    if (url.match(/^\/api\/models(\?|$)/)) return jsonResp(MODELS);

    // ─── Конкретная модель ───
    var mModel = url.match(/^\/api\/model\/([^\/\?]+)$/);
    if (mModel) {
      var id = mModel[1];
      // Если ID не передан или невалидный — возвращаем героиню (Алексу)
      if (!id || id === 'null' || id === 'undefined') {
        return jsonResp(MODELS[0]);
      }
      var found = MODELS.find(function(x){ return x.id === id; });
      return found ? jsonResp(found) : jsonResp(MODELS[0]); // fallback на Алексу
    }

    // ─── Видео модели ───
    var mModelVideos = url.match(/^\/api\/model\/([^\/\?]+)\/videos/);
    if (mModelVideos) {
      var mid = mModelVideos[1];
      var items = VIDEOS.filter(function(v){ return v.model_id === mid; });
      return jsonResp({ items: items, total: items.length });
    }

    // ─── Коллабораторы ───
    var mCollab = url.match(/^\/api\/model\/([^\/]+)\/collaborators/);
    if (mCollab) {
      var cmid = mCollab[1];
      return jsonResp({ collaborators: COLLABORATORS_BY_MODEL[cmid] || [] });
    }
    if (url.match(/\/collaborator\/(add|remove|leave)/)) return okResp();

    // ─── Public settings ───
    var mPS = url.match(/^\/api\/model\/([^\/]+)\/public-settings/);
    if (mPS) {
      var psmid = mPS[1];
      return jsonResp(PUBLIC_SETTINGS_BY_MODEL[psmid] || PUBLIC_SETTINGS_BY_MODEL['m1']);
    }

    // ─── Recent (последние видео для main.html) ───
    if (url.indexOf('/api/recent') !== -1) {
      return jsonResp(VIDEOS.slice(0, 4));
    }

    // ─── All videos ───
    if (url.match(/^\/api\/videos(\?|$)/)) {
      return jsonResp({ items: VIDEOS, total: VIDEOS.length });
    }

    // ─── Public feed ───
    if (url.indexOf('/api/public/feed') !== -1) {
      var pub = VIDEOS.filter(function(v){ return v.is_public; });
      return jsonResp({ items: pub, total: pub.length });
    }

    // ─── Single video ───
    var mVideo = url.match(/^\/api\/video\/([^\/\?]+)$/);
    if (mVideo) {
      var vid = mVideo[1];
      var v = VIDEOS.find(function(x){ return x.id === vid; });
      return v ? jsonResp(v) : jsonResp({ error: 'not found' }, 404);
    }
    if (url.match(/\/api\/video\/[^\/]+\/(delete|like|public|private)/)) return okResp();

    // ─── Подписка ───
    if (url.indexOf('/api/subscription') !== -1) return jsonResp(SUBSCRIPTION);

    // ─── Tokens history ───
    if (url.indexOf('/api/tokens/history') !== -1) {
      return jsonResp({ history: TOKENS_HISTORY });
    }

    // ─── Invite stats ───
    if (url.indexOf('/api/invite/stats') !== -1) return jsonResp(INVITE_STATS);

    // ─── Generation status (вечно "running" для демо) ───
    var mGen = url.match(/\/api\/generation\/(\d+)\/detailed-status/);
    if (mGen) {
      return jsonResp({
        gen_id: parseInt(mGen[1], 10),
        status: 'running',
        current_stage: 'GENERATING VIDEO',
        stage_progress: 42
      });
    }

    // ─── Старт генерации ───
    if (url.indexOf('/api/generation/start') !== -1) {
      return jsonResp({ ok: true, gen_id: 9001 });
    }

    // ─── Аплоад файла (фейк) ───
    if (url.indexOf('/api/upload') !== -1) {
      return jsonResp({ ok: true, path: '/tmp/demo_upload.bin' });
    }

    // ─── Создание модели ───
    if (url.indexOf('/api/model/create') !== -1) {
      return jsonResp({ ok: true, gen_id: 9002, model_id: 'm_new' });
    }

    // ─── Collab invites (входящие) ───
    if (url.indexOf('/api/collab-invites') !== -1) {
      return jsonResp({ invites: [
        { id: 1, model_id: 'm_other_1', model_name: 'Lina', model_preview_url: 'assets/girlmodelmexico.png', inviter_name: '@daria_v', invited_at: '2026-04-25 10:00' },
        { id: 2, model_id: 'm_other_2', model_name: 'Aurora', model_preview_url: 'assets/blondblueseysgirl.jfif', inviter_name: '@max_p', invited_at: '2026-04-23 18:30' }
      ]});
    }

    // ─── Дефолт: пустой OK ───
    return okResp();
  };

  // ─── Фейковый Telegram WebApp ───
  // Если приложение открыто не в Telegram — создаём заглушку,
  // чтобы tg.initData / tg.sendData / tg.expand не падали.
  if (!window.Telegram) window.Telegram = {};
  if (!window.Telegram.WebApp) {
    window.Telegram.WebApp = {
      initData: 'demo_init_data',
      initDataUnsafe: { user: { id: 123456789, first_name: 'harchevnikov', last_name: '', username: 'realnipacan', photo_url: '' } },
      ready: function(){},
      expand: function(){},
      setHeaderColor: function(){},
      setBackgroundColor: function(){},
      sendData: function(d){ console.log('[TG sendData mock]', d); },
      openTelegramLink: function(u){ window.open(u, '_blank'); },
      BackButton: { show: function(){}, hide: function(){}, onClick: function(){} },
      MainButton:  { show: function(){}, hide: function(){}, onClick: function(){}, setText: function(){} },
      HapticFeedback: { impactOccurred: function(){}, notificationOccurred: function(){}, selectionChanged: function(){} }
    };
  }

  // ─── Дефолтная выбранная модель (Алекса) для страниц генерации ───
  // Устанавливаем только если ничего не было выбрано раньше.
  try {
    if (!sessionStorage.getItem('selectedModelId')) {
      sessionStorage.setItem('selectedModelId', 'm1');
      sessionStorage.setItem('selectedModelName', 'Alexa');
      sessionStorage.setItem('selectedModelPreview', 'assets/red_hair_girl.png');
    }
  } catch (e) {}

  // ─── Если страница открыта без ?id=, вписываем дефолтный id=m1 ───
  // (нужно для model_detail.html / model_videos.html / model_share.html)
  try {
    var path = location.pathname.split('/').pop() || '';
    var detailPages = ['model_detail.html', 'model_videos.html', 'model_share.html'];
    if (detailPages.indexOf(path) !== -1 && !location.search) {
      // Добавляем параметр, не перезагружая страницу — скрипт страницы прочитает уже из URL
      var newUrl = location.pathname + '?id=m1&name=' + encodeURIComponent('Alexa') + '&preview=' + encodeURIComponent('assets/red_hair_girl.png');
      history.replaceState({}, '', newUrl);
    }
  } catch (e) {}

  // Префиксуем: помечаем что демо-режим активен (для отладки)
  window.__FAMOUS_DEMO_MODE__ = true;
  console.log('[FAMOUS DEMO] Mock data loaded — all /api/* calls intercepted.');
})();

/* ── Presentation: scroll-to-target via postMessage from parent presentation ── */
(function famousPresoScroll(){
  function findEl(target){
    if(target === 'top') return null;
    const heads = document.querySelectorAll('.section-head');
    if(target === 'models') return heads[0] || null;
    if(target === 'recent') return heads[1] || null;
    if(target === 'stats')  return document.querySelector('.stats-strip');
    return null;
  }
  let lastReceivedTime = 0;
  function getScroller(){
    const sc = document.querySelector('.app-scroll');
    return (sc && sc.scrollHeight > sc.clientHeight + 4) ? sc : null;
  }
  function applyProgress(p){
    p = Math.max(0, Math.min(1, p));
    const sc = getScroller();
    if (sc){
      sc.scrollTop = (sc.scrollHeight - sc.clientHeight) * p;
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      window.scrollTo(0, max * p);
    }
  }
  function getCurrentProgress(){
    const sc = getScroller();
    if (sc){
      const max = sc.scrollHeight - sc.clientHeight;
      return max>0 ? sc.scrollTop / max : 0;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max>0 ? window.scrollY / max : 0;
  }
  // Discrete targets — snap to specific anchors with smooth animation
  function doScroll(target){
    lastReceivedTime = Date.now();
    if(target === 'top'){ applyProgress(0); return; }
    const el = findEl(target);
    if(!el) return;
    // Custom positioning: place target ~16px from top of visible area (instead of centering).
    // Avoids the dramatic "shift up" of scrollIntoView({block:'center'}) on short elements.
    const sc = getScroller();
    if (sc){
      const sR = sc.getBoundingClientRect();
      const eR = el.getBoundingClientRect();
      const max = sc.scrollHeight - sc.clientHeight;
      const top = Math.max(0, Math.min(max, sc.scrollTop + (eR.top - sR.top) - 16));
      sc.scrollTo({top, behavior:'smooth'});
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const elTopAbs = window.scrollY + el.getBoundingClientRect().top;
      const top = Math.max(0, Math.min(max, elTopAbs - 16));
      window.scrollTo({top, behavior:'smooth'});
    }
  }

  // Report progress back to parent (bidirectional sync)
  let lastReportedProgress = -1;
  function reportIfChanged(){
    if (Date.now() - lastReceivedTime < 700) return;
    const p = getCurrentProgress();
    if (Math.abs(p - lastReportedProgress) < 0.005) return;
    lastReportedProgress = p;
    try { window.parent && window.parent.postMessage({type:'famous-iframe-progress', progress:p}, '*'); } catch(e){}
  }
  let scheduled = false;
  function scheduleReport(){
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(()=>{ scheduled = false; reportIfChanged(); });
  }
  window.addEventListener('scroll', scheduleReport, {passive:true});
  document.addEventListener('scroll', scheduleReport, {passive:true, capture:true});
  window.addEventListener('message', function(e){
    if(!e.data) return;
    if(e.data.type === 'famous-scroll-progress'){
      lastReceivedTime = Date.now();
      applyProgress(e.data.progress);
      return;
    }
    if(e.data.type === 'famous-scroll'){
      let tries = 0;
      (function tick(){
        if(document.querySelector('.app-scroll')) return doScroll(e.data.target);
        if(++tries < 40) setTimeout(tick, 100);
      })();
    }
  });
  // Tell parent we're ready ONLY after the page is fully loaded and at top.
  // Sending too early (on script parse) causes layout shifts that look like a "jump up" on first user scroll.
  window.addEventListener('load', function(){
    setTimeout(function(){
      const sc = document.querySelector('.app-scroll');
      if (sc) sc.scrollTop = 0;
      window.scrollTo(0, 0);
      lastReceivedTime = Date.now();   // suppress own scroll listener for the next ~900ms
      try { window.parent && window.parent.postMessage({type:'famous-scroll-ready'}, '*'); } catch(e){}
    }, 80);
  });
})();
