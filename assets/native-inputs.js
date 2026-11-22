
(function(){try{var st=document.createElement('style');st.textContent='@supports (-webkit-touch-callout:none){.dt-field{flex:1 1 0!important;min-width:0!important;max-width:none!important;grid-column:auto!important;width:auto!important}.dt-field{margin-right:14px!important}.dt-field:last-child{margin-right:0!important}.dt-view{color:#1F2420!important;font-weight:500}.form-row{gap:12px!important}.dt-field input{width:100%!important;min-width:0!important;font-size:14px!important;padding-left:6px!important;padding-right:6px!important;text-align:center!important}.dt-has-view{position:relative!important}.dt-native-hidden{-webkit-text-fill-color:transparent!important;color:transparent!important}.dt-view{position:absolute;left:8px;right:26px;bottom:0;height:44px;display:flex;align-items:center;justify-content:center;font-size:14px;color:inherit;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}';document.head.appendChild(st);}catch(e){}})();
/* 全站日期/时间统一走系统原生控件；拆掉旧版自绘 dt-wrap，避免 iOS 上双层。 */
(function(){
  function pickType(inp){
    if(inp.type === 'date' || inp.type === 'time') return inp.type;
    var v = inp.value || '';
    var label = (inp.getAttribute('aria-label')||'') + ' ' + (inp.id||'') + ' ' + (inp.getAttribute('placeholder')||'');
    if(/^\d{4}-\d{1,2}-\d{1,2}/.test(v) || /日期|生日|date/i.test(label)) return 'date';
    if(/^\d{1,2}:\d{2}/.test(v) || /时间|时辰|time/i.test(label)) return 'time';
    return '';
  }
  function isIOS(){ return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1); }
  function shortVal(el){
    var v=el.value||'';
    if(el.type==='date'){ var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(v); return m?(m[1]+'-'+m[2]+'-'+m[3]):'请选择'; }
    if(el.type==='time'){ var t=/^(\d{2}:\d{2})/.exec(v); return t?t[1]:'请选择'; }
    return v;
  }
  function decorate(el){
    if(!isIOS()||!el||el.__dtDecorated) return;
    var f=el.closest && el.closest('.field'); if(!f) return;
    el.__dtDecorated=true;
    f.classList.add('dt-has-view');
    var view=f.querySelector('.dt-view');
    if(!view){ view=document.createElement('span'); view.className='dt-view'; f.appendChild(view); }
    el.classList.add('dt-native-hidden');
    function paint(){ view.textContent=shortVal(el); }
    paint();
    ['input','change','blur'].forEach(function(ev){ el.addEventListener(ev,paint); });
  }
  function fix(){
    var list = document.querySelectorAll('input.dt-input,input[type="time"],input[type="date"],.dt-wrap input');
    for(var i=0;i<list.length;i++){
      var inp=list[i];
      var t=pickType(inp);
      if(!t) continue;
      function fill(el){
        if(el.value || el.hasAttribute('data-keep')) return;
        var n=new Date(), p2=function(x){return String(x).padStart(2,'0')};
        if(el.type==='date') el.value=n.getFullYear()+'-'+p2(n.getMonth()+1)+'-'+p2(n.getDate());
        if(el.type==='time') el.value=p2(n.getHours())+':'+p2(n.getMinutes());
      }
      if(inp.__nativeFixed){ fill(inp); continue; }
      var c=inp.cloneNode(true);
      c.__nativeFixed=true; c.type=t; c.readOnly=false; c.removeAttribute('readonly');
      c.classList.remove('dt-input'); c.setAttribute('autocomplete','off');
      fill(c);
      var wrap=inp.parentElement;
      if(wrap && wrap.classList && wrap.classList.contains('dt-wrap')) wrap.parentNode.replaceChild(c,wrap);
      else inp.parentNode.replaceChild(c,inp);
      decorate(c);
    }
    document.querySelectorAll('.dt-wrap').forEach(function(w){ if(!w.querySelector('input')) w.remove(); });
  }
  /* 旧版自绘下拉（.sel-list）与 iOS 原生选择器会同时出现：这里把自绘层即时移除，只留原生。 */
  function killSel(){
    var n=document.querySelectorAll('.sel-list');
    for(var i=0;i<n.length;i++) n[i].remove();
  }
  try{ new MutationObserver(killSel).observe(document.body,{childList:true,subtree:true}); }catch(e){}
  setInterval(killSel,300);
  /* 原生下拉优先：在 window 捕获阶段截断源码自定义下拉的 mousedown，
     让浏览器默认行为打开系统选择器（安卓/iOS 一致） */
  window.addEventListener('mousedown', function(e){
    var t=e.target;
    if(t && t.closest && t.closest('select')) e.stopPropagation();
  }, true);
  window.addEventListener('touchstart', function(e){
    var t=e.target;
    if(t && t.closest && t.closest('select')) e.stopPropagation();
  }, true);
  /* 安卓旧版：源码自绘下拉会 preventDefault，补一次原生 showPicker */
  document.addEventListener('click', function(e){
    if(!/Android/i.test(navigator.userAgent)) return;
    var s=e.target && e.target.closest && e.target.closest('select');
    if(!s) return;
    if(s.showPicker){ try{ s.showPicker(); }catch(err){} }
  }, true);
  window.initPickers = fix;
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('input[type="date"],input[type="time"],.dt-input').forEach(decorate);
  });
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('input[type="date"],input[type="time"],.dt-input').forEach(function(el){
      var f=el.closest('.field'); if(f) f.classList.add('dt-field');
    });
  });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fix); else fix();
  window.addEventListener('load',function(){ fix(); setTimeout(fix,300); });
  setTimeout(fix,800);
  try{ new MutationObserver(function(){ clearTimeout(window.__nativeT); window.__nativeT=setTimeout(fix,120); }).observe(document.body,{childList:true,subtree:true}); }catch(e){}
})();
