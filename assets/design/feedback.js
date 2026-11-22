/* 轻量音效 + 震动：按压 / 开合 / 起盘成功 / 错误 / 保存成功 */
(function(){
  var AC=null, last={}, qzSound=function(){ try{return localStorage.getItem('qz-sound')==='1';}catch(e){return false;} };
  function audio(force){
    if(!force && !qzSound()) return null;
    try{
      if(!AC) AC=new (window.AudioContext||window.webkitAudioContext)();
      if(AC.state==='suspended') AC.resume();
      return AC;
    }catch(e){ return null; }
  }
  function tone(freq,dur,type,gain,slideTo,force){
    var ac=audio(force); if(!ac) return;
    var o=ac.createOscillator(), g=ac.createGain();
    o.type=type||'sine'; o.frequency.setValueAtTime(freq,ac.currentTime);
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,ac.currentTime+dur);
    g.gain.setValueAtTime(gain||0.03,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0008,ac.currentTime+dur);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+dur+0.01);
  }
  function haptic(kind){
    try{ if(localStorage.getItem('qz-vibe')==='0') return; }catch(e){}
    var map={light:[18],medium:[28],success:[12,45,12],error:[35,45,35]};
    var p=map[kind]||map.light;
    try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){}
    try{
      if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics){
        var H=Capacitor.Plugins.Haptics;
        if(kind==='success') H.notification({type:'SUCCESS'});
        else if(kind==='error') H.notification({type:'ERROR'});
        else H.impact({style:kind==='medium'?'MEDIUM':'LIGHT'});
      }
    }catch(e){}
  }
  function sfx(name){
    var now=Date.now();
    if(last[name]&&now-last[name]<120) return;
    last[name]=now;
    if(name==='press'){ tone(1000,0.04,'sine',0.035); haptic('light'); }
    else if(name==='open'){ tone(220,0.12,'sine',0.025,440); haptic('medium'); }
    else if(name==='close'){ tone(440,0.1,'sine',0.02,220); haptic('light'); }
    else if(name==='success'){ tone(523,0.09,'sine',0.03); setTimeout(function(){tone(784,0.12,'sine',0.028);},90); haptic('success'); }
    else if(name==='error'){ tone(180,0.16,'square',0.025,120); haptic('error'); }
    else if(name==='save'){ tone(660,0.08,'triangle',0.025); haptic('success'); }
  }
  window.xjSfx=sfx; window.xjHaptic=haptic; window.xjSfxPreview=function(){ tone(660,0.1,'sine',0.06,null,true); haptic('success'); };
  /* 首次手势解锁音频 */
  document.addEventListener('pointerdown',function once(){ audio(); document.removeEventListener('pointerdown',once); },{once:true});
  /* 按压 */
  document.addEventListener('pointerdown',function(e){
    var t=e.target&&e.target.closest&&e.target.closest('button,.tab,[role="button"]');
    if(!t||t.disabled) return;
    sfx('press');
  },{passive:true,capture:true});
  /* 起盘成功 / 错误 / 保存：观察结果区与提示 */
  function watchResult(){
    ['baziResultPage','zwResultPage','result-shell','resultPage'].forEach(function(id){
      var el=document.getElementById(id); if(!el||el.__fbWatched) return; el.__fbWatched=1;
      var was=!el.hidden&&getComputedStyle(el).display!=='none';
      var ob=new MutationObserver(function(){
        var on=!el.hidden&&getComputedStyle(el).display!=='none';
        if(on&&!was) sfx('success');
        was=on;
      });
      ob.observe(el,{attributes:true,attributeFilter:['hidden','style','class']});
    });
    var out=document.getElementById('out');
    if(out&&!out.__fbWatched){
      out.__fbWatched=1;
      var len=(out.innerText||'').length;
      new MutationObserver(function(){
        var n=(out.innerText||'').length;
        if(n>200&&n>len+40) sfx('success');
        len=n;
      }).observe(out,{childList:true,subtree:true});
    }
  }
  function watchToasts(){
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        (m.addedNodes||[]).forEach(function(n){
          if(n.nodeType!==1) return;
          var txt=(n.innerText||n.textContent||'').trim(); if(!txt||txt.length>80) return;
          if(/失败|错误|不能|请先|请输入|请输入|无效/.test(txt)) sfx('error');
          else if(/已保存|已存入|已同步|保存成功|已复制|已恢复/.test(txt)) sfx('save');
        });
      });
    }).observe(document.body,{childList:true,subtree:true});
  }
  /* 模块开合：监听 subpage 增加/隐藏 */
  function watchShell(){
    var layer=document.getElementById('subpage-layer'); if(!layer) return;
    var open=false;
    new MutationObserver(function(){
      var act=layer.querySelector('.subpage.active');
      if(act&&!open){ open=true; sfx('open'); }
      else if(!act&&open){ open=false; sfx('close'); }
    }).observe(layer,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
  }
  function init(){ watchResult(); watchToasts(); watchShell(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
