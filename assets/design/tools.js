/* 工具页统一：去品牌头、按钮/日历内联样式兜底 */
(function(){
  function paint(){
    var t=document.querySelector('.topbar'); if(t) t.remove();
    var cezi=document.body.getAttribute('data-xj-page')==='cezi';
    document.querySelectorAll('.btn,.lp-cat-btn,.lp-tool').forEach(function(b){
      var on=b.classList.contains('active');
      if(cezi && b.closest('.page-cz .form-row')) on=(b===b.parentElement.querySelector('button.btn'));
      b.style.setProperty('background', on?'#2F6F5B':'#FFFDF8','important');
      b.style.setProperty('color', on?'#FFFDF8':'#2F6F5B','important');
      b.style.setProperty('border', on?'0':'1px solid rgba(176,138,79,.28)','important');
      b.style.setProperty('border-radius','10px','important');
      b.style.setProperty('box-shadow','none','important');
    });
    document.querySelectorAll('.sd-num').forEach(function(n){
      n.style.setProperty('color','#1F2420','important');
      n.style.setProperty('font-weight','600','important');
    });
    document.querySelectorAll('.cal-cell.other .sd-num').forEach(function(n){
      n.style.setProperty('color','#9A9F99','important');
      n.style.setProperty('font-weight','400','important');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',paint); else paint();
  window.addEventListener('load',function(){paint();setTimeout(paint,300);});
  try{ new MutationObserver(function(){ clearTimeout(window.__tpT); window.__tpT=setTimeout(paint,80); }).observe(document.body,{childList:true,subtree:true}); }catch(e){}
})();
