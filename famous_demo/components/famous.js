// Scroll focused input/textarea into view + hide bottom nav while keyboard is open
document.addEventListener('focusin', function(e) {
  if (!e.target.matches('input, textarea')) return;
  document.body.classList.add('kb-open');
  setTimeout(() => {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
});
document.addEventListener('focusout', function(e) {
  if (!e.target.matches('input, textarea')) return;
  // small delay so quick refocus between fields doesn't flicker the nav
  setTimeout(() => {
    const a = document.activeElement;
    if (!a || !a.matches('input, textarea')) document.body.classList.remove('kb-open');
  }, 50);
});

// iOS keyboard dismiss: tap anywhere outside input/textarea/button blurs the focused field
document.addEventListener('touchend', function(e) {
  const a = document.activeElement;
  if (!a || !a.matches('input, textarea')) return;
  if (e.target.closest('input, textarea, button, a, [contenteditable], label')) return;
  a.blur();
}, { passive: true });

// Pressing Enter on a single-line input also dismisses the keyboard
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  const a = document.activeElement;
  if (a && a.tagName === 'INPUT') a.blur();
});

// iOS-style edge swipe-right to go back. Must start within 24px of the left edge
// so it never collides with horizontal carousels or sliders mid-screen.
(function(){
  const EDGE_PX = 24;
  const TRIGGER_DX = 70;
  const SLOPE_LIMIT = 0.5;     // |dy/dx| must stay below this — keeps it horizontal
  let sx = 0, sy = 0, active = false, fired = false, t0 = 0;
  document.addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) { active = false; return; }
    const t = e.touches[0];
    if (t.clientX > EDGE_PX) { active = false; return; }
    sx = t.clientX; sy = t.clientY; t0 = Date.now(); active = true; fired = false;
  }, { passive: true });
  document.addEventListener('touchmove', function(e){
    if (!active || fired) return;
    const t = e.touches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (dx <= 0) return;
    if (Math.abs(dy) / Math.max(1, dx) > SLOPE_LIMIT) { active = false; return; }
    if (dx > TRIGGER_DX && (Date.now() - t0) < 700) {
      fired = true; active = false;
      try {
        if (typeof window.goBackWithTransition === 'function') window.goBackWithTransition();
        else window.history.back();
      } catch (e) {}
    }
  }, { passive: true });
  document.addEventListener('touchend', function(){ active = false; }, { passive: true });
  document.addEventListener('touchcancel', function(){ active = false; }, { passive: true });
})();

// Show a loading spinner inside .vm-player while its <video> is buffering.
// Auto-wires whenever a <video> appears inside any .vm-player container.
(function(){
  function attach(video){
    if (video._vmLoaderWired) return;
    video._vmLoaderWired = true;
    const player = video.closest('.vm-player');
    if (!player) return;
    if (player.querySelector('.vm-loading')) return;
    if (video.readyState >= 3) return; // already has enough data
    const spinner = document.createElement('div');
    spinner.className = 'vm-loading';
    player.appendChild(spinner);
    player.classList.add('is-loading');
    const done = () => {
      player.classList.remove('is-loading');
      if (spinner.parentNode) spinner.parentNode.removeChild(spinner);
      video.removeEventListener('canplay', done);
      video.removeEventListener('playing', done);
      video.removeEventListener('loadeddata', done);
      video.removeEventListener('error', done);
    };
    video.addEventListener('canplay', done);
    video.addEventListener('playing', done);
    video.addEventListener('loadeddata', done);
    video.addEventListener('error', done);
  }
  function scan(root){
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.vm-player video').forEach(attach);
  }
  const obs = new MutationObserver(muts => {
    for (const m of muts){
      m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches('.vm-player video')) attach(n);
        else scan(n);
      });
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scan(document));
  else scan(document);
})();

// ── Pending collab-invite indicator on the Profile bottom-nav button ─────────
(function () {
  function getInitData() {
    try { return (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) || ''; }
    catch (e) { return ''; }
  }

  function findProfileNavBtn() {
    // Совпадает с шаблоном в каждой странице — ищем по onclick="...profile.html..."
    const btns = document.querySelectorAll('.bottom-nav .nav-btn');
    for (const b of btns) {
      const a = b.getAttribute('onclick') || '';
      if (a.includes("profile.html")) return b;
    }
    return null;
  }

  function setBadge(btn, count) {
    if (!btn) return;
    let dot = btn.querySelector('.fnav-dot');
    if (!count) { if (dot) dot.remove(); return; }
    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'fnav-dot';
      Object.assign(dot.style, {
        position: 'absolute',
        top: '6px',
        right: '14px',
        minWidth: '16px',
        height: '16px',
        padding: '0 4px',
        borderRadius: '999px',
        background: 'var(--brand)',
        color: '#000',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '0.04em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 0 2px var(--bg, #070707)',
        pointerEvents: 'none',
        zIndex: '2',
      });
      // Сделать nav-btn относительным контейнером для абс. позиционирования
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.appendChild(dot);
    }
    dot.textContent = count > 9 ? '9+' : String(count);
  }

  async function refreshBadge() {
    try {
      const r = await fetch('/api/profile', { headers: { 'X-Telegram-Init-Data': getInitData() } });
      if (!r.ok) return;
      const d = await r.json();
      setBadge(findProfileNavBtn(), Number(d.pending_invites || 0));
    } catch (e) {}
  }

  function init() {
    if (!document.querySelector('.bottom-nav')) return;
    refreshBadge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.addEventListener('pageshow', () => {
    if (document.querySelector('.bottom-nav')) refreshBadge();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && document.querySelector('.bottom-nav')) refreshBadge();
  });
})();
