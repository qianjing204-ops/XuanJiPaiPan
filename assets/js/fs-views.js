/* 阳宅风水：输入页 / 结果页 两视图切换
   - 输入页只显示「基础设定」，不显示排盘；
   - 起盘后切到结果页：五层（定运/立向/定人/避煞/布局）+ 综合诊断；
   - 结果页右下角浮「AI 解析」按钮，左下角浮「‹ 返回修改」。 */
(function () {
  'use strict';
  var page = document.querySelector('.page-fs .page');
  if (!page) return;

  var SECTION_IDS = ['fsmod-l1', 'fsmod-l2', 'fsmod-l3', 'fsmod-l4', 'fsmod-l5'];

  function makeFloat(cls, text) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fs-float ' + cls;
    b.textContent = text;
    document.body.appendChild(b);
    return b;
  }
  var backBtn = makeFloat('fs-back', '‹ 返回修改');
  var aiBtn = makeFloat('fs-ai', 'AI 解析');

  function expandAll() {
    SECTION_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('collapsed');
    });
    var zh = document.querySelector('.page-fs section[id^="fsmod"]');
    if (zh) zh.classList.remove('collapsed');
  }

  function setMode(result) {
    page.classList.toggle('fs-result-mode', !!result);
    page.classList.toggle('fs-input-mode', !result);
    if (result) expandAll();
    backBtn.style.display = result ? '' : 'none';
    aiBtn.style.display = result ? '' : 'none';
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    if (history.replaceState) history.replaceState(null, '', result ? '#result' : location.pathname + location.search);
  }

  function openAi() {
    if (typeof window.xjOpenChat === 'function') {
      try { window.xjOpenChat(); return; } catch (e) {}
    }
    var blk = document.getElementById('aiBlock');
    if (blk) { blk.open = true; try { blk.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {} return; }
    alert('AI 对话尚未加载，请刷新页面');
  }

  backBtn.addEventListener('click', function () { setMode(false); });
  window.__fsBackToInput = function () {
    if (!page.classList.contains('fs-result-mode')) return false;
    setMode(false);
    return true;
  };
  aiBtn.addEventListener('click', openAi);

  function bindPan() {
    var btn = document.querySelector('button[onclick="fsCalc()"]');
    if (!btn || btn.__fsViewBound) return;
    btn.__fsViewBound = true;
    btn.addEventListener('click', function () { setTimeout(function () { setMode(true); }, 200); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindPan);
  else bindPan();
  setTimeout(bindPan, 900);

  setMode(location.hash === '#result');
})();
