/* Apple 质感交互内核 v1：按压反馈 + shell 左缘 1:1 拖拽 */
(function(){
  var pressed=null;
  function isControl(t){
    return t && t.closest && t.closest('button,.btn,.tab,.card[data-press],[role="button"]');
  }
  document.addEventListener('pointerdown', function(e){
    if(e.button!==undefined && e.button!==0) return;
    var el=isControl(e.target); if(!el) return;
    if(el.disabled) return;
    pressed=el; el.classList.add('xj-pressed');
  }, {passive:true, capture:true});
  function release(){ if(pressed){ pressed.classList.remove('xj-pressed'); pressed=null; } }
  document.addEventListener('pointerup', release, {passive:true, capture:true});
  document.addEventListener('pointercancel', release, {passive:true, capture:true});
  window.addEventListener('blur', release);

});
