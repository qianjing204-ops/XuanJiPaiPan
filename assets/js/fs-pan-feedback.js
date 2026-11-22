/* 阳宅页：起盘反馈层
   1) 点「起盘」后自动展开三层结果并滚到第一层——原来结果在折叠区里，看起来像没反应；
   2) 捕获页面脚本错误并就地显示，避免静默失败。 */
(function () {
  'use strict';
  var bar = null;
  function show(msg) {
    if (!bar) {
      bar = document.createElement('div');
      bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:99999;background:#2F6F5B;color:#fff;font-size:13px;line-height:1.5;padding:10px 14px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);transition:opacity .3s';
      document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.opacity = '1';
    clearTimeout(bar._t);
    bar._t = setTimeout(function () { bar.style.opacity = '0'; }, 2600);
  }

  function expand() {
    var ids = ['fsmod-l1', 'fsmod-l2', 'fsmod-l3'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('collapsed');
    });
    var first = document.getElementById('fsmod-l1');
    if (first && first.scrollIntoView) {
      setTimeout(function () { first.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
    }
  }

  function bind() {
    var btn = document.querySelector('button[onclick="fsCalc()"]');
    if (!btn || btn.__fsBound) return;
    btn.__fsBound = true;
    btn.addEventListener('click', function () {
      setTimeout(function () { expand(); show('已重新起盘'); }, 180);
    });
  }

  window.addEventListener('error', function (e) {
    var msg = (e && (e.message || (e.error && e.error.message))) || '脚本错误';
    show('页面脚本错误：' + msg);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  setTimeout(bind, 800);
})();
