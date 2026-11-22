/* 统一按压反馈 + 弹簧工具；尊重 prefers-reduced-motion */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function bindPress(root){
    root.addEventListener('pointerdown', function(e){
      var el = e.target && e.target.closest && e.target.closest('.ds-btn,button,.tool-card,.card');
      if(!el) return;
      el.classList.add('ds-pressed');
    }, {passive:true});
    ['pointerup','pointercancel','pointerleave'].forEach(function(t){
      root.addEventListener(t, function(e){
        var el = e.target && e.target.closest && e.target.closest('.ds-btn,button,.tool-card,.card');
        if(el) el.classList.remove('ds-pressed');
      }, {passive:true});
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){bindPress(document.body)});
  else bindPress(document.body);
  window.DS = window.DS || {};
  window.DS.reduceMotion = reduce;
  window.DS.spring = function(el, from, to, velocity, onDone){
    if(reduce){ el.style.transform = to === 0 ? '' : 'translateY('+to+'px)'; if(onDone) onDone(); return; }
    if(el.__dsSpring) cancelAnimationFrame(el.__dsSpring);
    var x=from, v=velocity||0, last=performance.now(), w=2*Math.PI/0.35;
    (function frame(now){
      var dt=Math.min(0.064, Math.max(0.001,(now-last)/1000)); last=now;
      var a=-w*w*(x-to)-2*w*v; v+=a*dt; x+=v*dt;
      if(Math.abs(x-to)<0.5 && Math.abs(v)<8){ el.style.transform = to===0?'':'translateY('+to+'px)'; el.__dsSpring=null; if(onDone)onDone(); return; }
      el.style.transform='translateY('+x+'px)'; el.__dsSpring=requestAnimationFrame(frame);
    })(performance.now());
  };
})();

/* 紫微：把散落的表单行包进同一张卡（不改原 DOM 语义，只搬节点） */
(function(){
  function wrapZw(){
    var host=document.querySelector('.page-zw');
    if(!host) return;
    var page=host.querySelector('.page')||host;
    if(page.querySelector('.ds-form-card')) return;
    var items=[].slice.call(page.children).filter(function(el){
      return el.className && /(^|\s)(form-row|birth-group|opts-row)(\s|$)/.test(String(el.className));
    });
    if(!items.length) return;
    var card=document.createElement('div');
    card.className='ds-form-card';
    page.insertBefore(card, items[0]);
    items.forEach(function(el){ card.appendChild(el); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wrapZw); else wrapZw();
  window.addEventListener('load',function(){ wrapZw(); });
})();
