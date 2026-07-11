/* FAMOUS Demo Slide Guard
   Restricts interactive elements inside iframe phone-mockups per presentation slide.
   Include this script last in <body> on every affected demo page.
   The iframe src must include ?slide=<key>.

   Behaviour: instead of a text toast, an "access locked" padlock icon pops up
   near the pointer on hover over any unavailable control (the system cursor is
   left unchanged), and a short "denied" shake plays when such a control is
   clicked. Same per-slide block logic. */
(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var slide  = params.get('slide');
  if (!slide) return;

  var path = window.location.pathname;

  /* Interactive controls that can carry a lock. Hover-lock is scoped to these so
     the padlock never appears over plain text / backgrounds. */
  var INTERACTIVE =
    '.back-btn,.nav-btn,.nav-center,.cta-card,.see-all,#creditChip,#avatarBtn,' +
    '.model-card,.model-add,.stat-card,.video-card,.vm-close,.vm-share,' +
    '.priv-share-btn,.priv-copy-btn,.priv-toggle-btn,#upgradePlanBtn,' +
    '.plan-card,.pc-cta,.token-pack,.hist-link,.md-action,.sp-btn,.sp-toggle,' +
    '.confirm-ok,.confirm-cancel,.cm-btn,.vis-banner,.vb-link,.edit-save,' +
    '.ps-save,.ps-switch,.ps-section-head,.pf-menu-item,.pf-quick,' +
    '.ci-cta-bottom,.inv-copy-btn,.inv-share-btn,.sub-step,button,a,[onclick]';

  var ALLOWED_13A = ['Tokens & Plan', 'Tokens history', 'Collaboration invites'];

  /* ── Lock icon (padlock) — injected styles + floating badge ─────────── */
  var style = document.createElement('style');
  style.textContent =
    '.demo-lock-badge{position:fixed;top:0;left:0;z-index:2147483647;pointer-events:none;' +
    'width:38px;height:38px;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(12,12,12,0.94);border:1px solid rgba(61,255,110,0.4);border-radius:50%;' +
    'box-shadow:0 8px 22px rgba(0,0,0,0.55),0 0 16px rgba(61,255,110,0.28);' +
    'opacity:0;transform:translate(-50%,-50%) scale(.35);' +
    'transition:opacity .15s ease,transform .2s cubic-bezier(.34,1.56,.64,1);}' +
    '.demo-lock-badge svg{width:19px;height:19px;display:block;}' +
    '.demo-lock-badge.show{opacity:1;transform:translate(-50%,-50%) scale(1);}' +
    '.demo-lock-badge.deny{animation:demoLockDeny .42s ease;}' +
    '@keyframes demoLockDeny{' +
    '0%{transform:translate(-50%,-50%) scale(1) rotate(0);}' +
    '18%{transform:translate(-50%,-50%) scale(1.14) rotate(-11deg);}' +
    '38%{transform:translate(-50%,-50%) scale(1.06) rotate(9deg);}' +
    '58%{transform:translate(-50%,-50%) scale(1.1) rotate(-7deg);}' +
    '78%{transform:translate(-50%,-50%) scale(1.04) rotate(4deg);}' +
    '100%{transform:translate(-50%,-50%) scale(1) rotate(0);}}';
  document.head.appendChild(style);

  var badge = document.createElement('div');
  badge.className = 'demo-lock-badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#3dff6e" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="4.5" y="10.3" width="15" height="10.2" rx="2.3" fill="rgba(61,255,110,0.10)"/>' +
    '<path d="M8 10.3V7.5a4 4 0 0 1 8 0v2.8"/>' +
    '<circle cx="12" cy="15" r="1.5" fill="#3dff6e" stroke="none"/>' +
    '<path d="M12 16.4v1.8" stroke-width="2"/></svg>';

  function ensureBadge() {
    if (!badge.parentNode && document.body) document.body.appendChild(badge);
  }
  ensureBadge();

  var hideT;
  function place(x, y) { badge.style.left = (x + 15) + 'px'; badge.style.top = (y - 15) + 'px'; }
  function showLock(x, y) { ensureBadge(); place(x, y); badge.classList.add('show'); clearTimeout(hideT); }
  function hideLock() { clearTimeout(hideT); hideT = setTimeout(function () { badge.classList.remove('show'); }, 50); }
  function denyLock(x, y) {
    ensureBadge(); place(x, y);
    badge.classList.add('show');
    badge.classList.remove('deny'); void badge.offsetWidth; badge.classList.add('deny');
    clearTimeout(hideT);
    hideT = setTimeout(function () { badge.classList.remove('show', 'deny'); }, 720);
  }

  /* ══════════════════════════════════════════════════════════════════
     Per-slide predicate — is a click on `t` an unavailable action?
     Mirrors the original block logic 1:1 for each slide/page.
  ══════════════════════════════════════════════════════════════════ */
  function clickBlocked(t) {
    if (!t || !t.closest) return false;

    if (slide === '3') {
      return !!t.closest(
        '.nav-btn,.nav-center,.cta-card,.see-all,' +
        '#creditChip,#avatarBtn,.model-card,.model-add,' +
        '.stat-card[onclick],.video-card,' +
        '.vm-close,.vm-share,.priv-share-btn,.priv-copy-btn,.priv-toggle-btn'
      );
    }

    if (slide === '7') {
      return !!t.closest('.back-btn,.nav-btn,.nav-center,#upgradePlanBtn,#minimizeBtn');
    }

    if (slide === '8') {
      if (path.indexOf('subscription') !== -1) {
        if (t.closest('.plan-card.current .pc-cta')) return false;
        if (t.closest('.token-pack:not(.locked)')) return false;
        if (t.closest('.hist-link')) return false;
        if (t.closest('#cmCancel,#cmConfirm')) return false;
        if (t.id === 'cmOverlay') return false;
      }
      return true; /* everything else disabled */
    }

    if (slide === '11') {
      if (t.closest('.sub-step')) return false;      /* share button in sub-header */
      if (t.id === 'spOverlay') return false;        /* overlay closes share panel */
      var inCollab = t.closest('#collabSection');
      if (inCollab) {
        var inAddBox = t.closest('#collabAddBox');
        var btn = t.closest('button');
        if (!inAddBox) {
          if (btn && /\+\s*add/i.test(btn.textContent)) return false; /* + Add */
          if (btn) return true;                                       /* Remove / Revoke */
        } else {
          if (btn) return false;                                      /* Cancel / Grant */
        }
      }
      return !!t.closest(
        '.back-btn,.nav-btn,.nav-center,.md-action,.sp-btn,.sp-toggle,' +
        '.confirm-ok,.confirm-cancel,.cm-btn,.vis-banner,.vb-link,' +
        '.edit-save,.ps-save,.ps-switch,.ps-section-head'
      );
    }

    if (slide === '13a') {
      /* profile.html menu logic */
      var pb = false;
      var item = t.closest('.pf-menu-item');
      if (item) {
        if (item.hasAttribute('onclick')) {
          var title = item.querySelector('.mi-title');
          pb = !(title && ALLOWED_13A.indexOf(title.textContent.trim()) !== -1);
        }
      } else {
        pb = !!t.closest('.back-btn,.nav-btn,.nav-center,.pf-quick,button,a,[onclick]');
      }
      /* collab_invites.html blocks (same slide key) */
      var cb = !!t.closest('.ci-cta-bottom,.back-btn,.nav-btn,.nav-center');
      return pb || cb;
    }

    if (slide === '13b') {
      return !!t.closest('.back-btn,.nav-btn,.nav-center');
    }

    if (slide === '13c') {
      return !!t.closest(
        '.back-btn,.nav-btn,.nav-center,.inv-copy-btn,.inv-share-btn,button,[onclick]'
      );
    }

    return false;
  }

  /* ── Click: prevent the unavailable action + play the denied shake ──── */
  document.addEventListener('click', function (e) {
    if (clickBlocked(e.target)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      denyLock(e.clientX, e.clientY);
    }
  }, true);

  /* ── Hover: show the padlock popup over any unavailable control.
     The system cursor is intentionally left untouched — only the floating
     padlock badge signals unavailability. ─────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    var el = e.target && e.target.closest ? e.target.closest(INTERACTIVE) : null;
    if (el && clickBlocked(el)) {
      showLock(e.clientX, e.clientY);
    } else {
      hideLock();
    }
  }, true);

  document.addEventListener('mouseleave', function () { hideLock(); }, true);

  /* ── Slide 11: block focusing the collaborator username input ───────── */
  if (slide === '11') {
    document.addEventListener('focusin', function (e) {
      if (e.target.id === 'collabInput') {
        e.target.blur();
        var r = e.target.getBoundingClientRect();
        denyLock(r.left + r.width / 2, r.top + r.height / 2);
      }
    }, true);
  }

})();
