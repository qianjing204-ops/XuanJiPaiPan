/* 新模块音效/震动桥接：把「结果区出现内容」映射成 xjSfx('success') / 失败映射成 'error'。
   音效与震动本体仍由 assets/design/feedback.js 提供，开关（qz-sound / qz-vibe）全局一致。 */
(function () {
  'use strict';
  window.__xjsfx = window.__xjsfx || { fires: [], ready: false };
  function fx(name) {
    window.__xjsfx.fires.push(name);
    try { if (window.xjSfx) window.xjSfx(name); } catch (e) {}
  }
  var WATCH = ['#out', '#result', '#result-shell', '#jkOut', '#dyOut', '#lqjOut', '#jyOut', '#slOut', '#tnOut', '[data-out]', '.result', '.result-box'];
  var lastLen = 0;
  var armed = false;
  var startedAt = Date.now();

  function snapshot() {
    var text = '';
    for (var i = 0; i < WATCH.length; i++) {
      var list = document.querySelectorAll(WATCH[i]);
      for (var k = 0; k < list.length; k++) {
        var t = list[k].innerText || list[k].textContent || '';
        if (t.length > text.length) text = t;
      }
    }
    return text;
  }

  function tick() {
    var text = snapshot();
    var len = text.length;
    if (!armed) {
      // 首屏渲染不算「起盘成功」
      if (Date.now() - startedAt > 2500) { armed = true; lastLen = len; }
      return;
    }
    if (len > lastLen + 24) {
      lastLen = len;
      if (/失败|错误|不能|请先|请输入|无效/.test(text.slice(-80))) fx('error');
      else fx('success');
    } else if (len < lastLen) {
      lastLen = len;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  function start() {
    setInterval(tick, 700);
    document.documentElement.dataset.xjsfx = 'ready';
    window.__xjsfx.ready = true;
  }
})();
