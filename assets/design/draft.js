/* 表单草稿：关闭模块后重开仍保留上次输入 */
(function(){
  var key='xjDraft:'+location.pathname;
  function fields(){
    return [].slice.call(document.querySelectorAll('input,select,textarea')).filter(function(el){
      if(!el.id && !el.name) return false;
      if(/password|file|hidden|submit|button|search/i.test(el.type||'')) return false;
      return true;
    });
  }
  function save(){
    var o={};
    fields().forEach(function(el){
      var k=el.id||el.name;
      if(el.type==='checkbox'||el.type==='radio') o[k]=el.checked?'1':'0';
      else o[k]=el.value;
    });
    try{ localStorage.setItem(key, JSON.stringify(o)); }catch(e){}
  }
  var t=null;
  function later(){ clearTimeout(t); t=setTimeout(save,250); }
  function restore(){
    var o; try{ o=JSON.parse(localStorage.getItem(key)||'null'); }catch(e){ return; }
    if(!o) return;
    fields().forEach(function(el){
      var k=el.id||el.name; if(!(k in o)) return;
      if(el.type==='checkbox'||el.type==='radio'){ el.checked=o[k]==='1'; }
      else if(o[k]!=='' && o[k]!=null){ el.value=o[k]; }
      try{ el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(restore,350); });
  else setTimeout(restore,350);
  window.addEventListener('load', function(){ setTimeout(restore,650); });
  document.addEventListener('input', later, true);
  document.addEventListener('change', later, true);
})();
