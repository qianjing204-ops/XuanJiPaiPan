/* ios-skin.js v1 —— iOS 换肤试水（八字/紫微/铁板）
   职责：独立态 .ios-gear-admin 三击进后台（1.5s 清零、data-step 两级变深反馈）。
   嵌入态（html.embed）下 .ios-top 整体隐藏：返回由外壳 .xj-back 提供，
   齿轮由外壳 app.html 在同侧渲染并直连 QZCFG 抽屉，本脚本不参与。
   不含动画、不改任何算法与数据逻辑。 */
(function(){
  try{
    if(window.self !== window.top) return;
    if(/(?:^|[?&])embed=1(?:&|$)/.test(window.location.search || '')) return;
    var gear = document.getElementById('iosGear');
    if(!gear) return;
    var hits = 0, timer = null, last = 0;
    gear.addEventListener('click', function(){
      var now = Date.now();
      if(now - last < 40) return; /* 防同一触摸派生的重复 click */
      last = now;
      hits = hits + 1;
      if(timer){ clearTimeout(timer); timer = null; }
      if(hits >= 3){
        hits = 0;
        gear.removeAttribute('data-step');
        window.location.href = '/static/admin.html';
        return;
      }
      gear.setAttribute('data-step', String(hits));
      timer = setTimeout(function(){ hits = 0; gear.removeAttribute('data-step'); }, 1500);
    });
  }catch(e){}
})();
