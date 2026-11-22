/* 排盘页两级返回：结果页 -> 输入页（保留输入）-> 推演 */
(function(){
  var sx=0, sy=0, armed=false;
  function visible(id){
    var e=document.getElementById(id);
    return !!(e && !e.hidden && e.offsetParent!==null && e.getBoundingClientRect().height>0);
  }
  var formScroll=0;
  window.addEventListener('scroll', function(){
    if(!visible('baziResultPage') && !visible('zwResultPage') && !visible('result-shell')) formScroll=window.scrollY||0;
  }, {passive:true});
  function back(){
    if(visible('baziResultPage') && typeof window.baziLeaveResult==='function'){ window.baziLeaveResult(); setTimeout(function(){ window.scrollTo(0,formScroll); },60); return true; }
    if(visible('zwResultPage') && typeof window.zwLeaveResult==='function'){ window.zwLeaveResult(); setTimeout(function(){ window.scrollTo(0,formScroll); },60); return true; }
    if(visible('result-shell') && typeof window.shellAgain==='function'){ window.shellAgain(); setTimeout(function(){ window.scrollTo(0,formScroll); },60); return true; }
    if(typeof window.__fsBackToInput==='function'){ try{ if(window.__fsBackToInput()){ window.scrollTo(0,formScroll); return true; } }catch(e){} }
    if(typeof window.shellAgain==='function' && !document.getElementById('lyFormPage')){ window.shellAgain(); return true; }
    return false;
  }
  window.__xjBack = back;
  document.addEventListener('touchstart', function(e){
    if(e.touches.length!==1) return;
    var t=e.touches[0];
    if(t.clientX<=26){ sx=t.clientX; sy=t.clientY; armed=true; }
  }, {passive:true});
  document.addEventListener('touchend', function(e){
    if(!armed) return; armed=false;
    var t=e.changedTouches[0], dx=t.clientX-sx, dy=Math.abs(t.clientY-sy);
    if(dx>70 && dy<60) back();
  }, {passive:true});
})();
