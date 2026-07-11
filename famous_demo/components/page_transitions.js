/* Staggered fade-up reveal for top-level page blocks.
   Loaded synchronously in <head> so the hidden state lands before
   <body> ever paints. */
(function(){
  var root = document.documentElement;
  var MAX_STAGGER = 14;
  root.classList.add('pt-stagger-ready');

  function isHidden(el){
    var s = window.getComputedStyle(el);
    return s.display === 'none' || s.visibility === 'hidden';
  }

  /** Mark a container's direct children as stagger items, then animate them in. */
  function stagger(container){
    if(!container) return;
    var kids = container.children, idx = 0;
    var visible = [];
    for(var i = 0; i < kids.length; i++){
      var el = kids[i];
      if(isHidden(el)) continue;
      // Skip elements we've already animated this session
      if(el.classList.contains('pt-done')) continue;
      el.classList.add('pt-item');
      el.style.setProperty('--pt-i', Math.min(idx, MAX_STAGGER));
      visible.push(el);
      idx++;
    }
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        for(var i = 0; i < visible.length; i++){
          (function(el){
            el.classList.add('pt-show');
            // After the animation completes, drop the helper classes so the
            // element can be re-styled / re-rendered without lingering state.
            var DUR = 420 + MAX_STAGGER * 55 + 120;
            setTimeout(function(){
              el.classList.remove('pt-item','pt-show');
              el.classList.add('pt-done');
              el.style.removeProperty('--pt-i');
            }, DUR);
          })(visible[i]);
        }
      });
    });
  }

  /** Public: re-trigger stagger on a container (e.g. after async content loads). */
  window.pageStagger = function(target){
    var c = (typeof target === 'string') ? document.querySelector(target) : target;
    if(!c) c = document.querySelector('.app-scroll');
    if(!c) return;
    // Reset done flags so previously hidden children can animate now.
    var kids = c.children;
    for(var i = 0; i < kids.length; i++) kids[i].classList.remove('pt-done');
    stagger(c);
  };

  function bootReveal(){
    var scroll = document.querySelector('.app-scroll');
    if(!scroll){ root.classList.remove('pt-stagger-ready'); return; }
    stagger(scroll);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootReveal, {once:true});
  } else {
    bootReveal();
  }

  // Back navigation alias — no exit animation, the next page handles all visuals.
  window.goBackWithTransition = function(){
    try { window.history.back(); } catch(_){}
  };
})();
