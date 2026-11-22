/* 河洛理数 · AI 解析挂载 */
(function () {
  'use strict';
  var PROMPT = [
    '本盘为河洛理数（河图洛书体系）。请严格依据盘面作答，按顺序组织：',
    '一、命卦：先天卦与后天卦各是什么，如何由天地数推出；',
    '二、数理：年月日时各层的天地数、生成数与卦象变化；',
    '三、爻位：所值爻位、当位与否、承乘比应；',
    '四、岁运：结合大运与流年，指出吉凶趋向与应事范围；',
    '五、建议：给出可操作的方向性建议，不做绝对化断言。',
    '规则：数理与卦象必须与盘面一致，不得自造卦象或爻辞；盘面未给出的项明说“盘面未给出”；',
    '引用河洛理数体系时注明依据；末尾提示仅供传统文化研究参考。'
  ].join('\n');

  var SCHOOLS = [
    { key: 'luoshu', name: '河洛理数', brief: '以天地数、生成数与先后天卦爻位为断，重数理结构。' },
    { key: 'xiantian', name: '先后天卦法', brief: '以先天后天卦象、方位与卦气为断，重卦象取义。' },
    { key: 'shuli', name: '数理象占', brief: '以奇偶、旺衰、成数之象为断，重数之象义。' }
  ];

  function readPan() {
    var out = [];
    var main = document.getElementById('hlResultPage');
    if (main) out.push((main.textContent || '').replace(/\s+/g, ' ').trim());
    ['hlNianOut', 'hlYueOut', 'hlRiOut', 'hlDyOut', 'hlQgOut', 'hlHeOut'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
    });
    return out.join('\n\n').slice(0, 8000);
  }

  function mount() {
    if (typeof window.mountAI !== 'function' || window.__hlAiMounted) return;
    window.__hlAiMounted = true;
    window.mountAI(readPan, '河洛理数', {
      systemPrompt: PROMPT,
      temperature: 0.3,
      schools: SCHOOLS,
      schoolLabel: '断法流派',
      schoolClosing: '每派段末写明本派判名、关键依据与对应卦象。',
      schoolSummary: '三派成段后总收：先列共识、再列分歧，写明主判与取用。',
      share: { page: 'heluo', title: '河洛理数在线排盘' }
    });
  }

  if (document.readyState === 'complete') setTimeout(mount, 0);
  else window.addEventListener('load', function () { setTimeout(mount, 0); });
})();
