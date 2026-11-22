/* 太岁生肖 · AI 解析挂载 */
(function () {
  'use strict';
  var PROMPT = [
    '本盘为太岁生肖（本命与流年太岁关系）。请严格依据盘面作答，按顺序组织：',
    '一、本命：本命年支、生肖与本命太岁所居方位；',
    '二、流年：流年太岁干支、与本年支的关系（值太岁、冲、刑、害、破）；',
    '三、判定：值/刑/冲/害/破各有几项，逐条说清判据；',
    '四、运势：按盘面给出的生肖运程要点归纳，不夸大、不制造恐慌；',
    '五、化解：给民俗层面的可执行做法（拜太岁、安太岁、供品与时间），并注明哪些属民俗仪轨、哪些属命理推论。',
    '规则：不得使用恐吓性表述；健康问题先提示就医；盘面未给出的项明说“盘面未给出”，不得自造神煞；',
    '末尾提示仅供传统文化研究参考。'
  ].join('\n');

  var SCHOOLS = [
    { key: 'shensha', name: '神煞刑冲', brief: '以值冲刑害破、岁破与太岁方位为断，重神煞关系。' },
    { key: 'bazi', name: '本命四柱', brief: '以本命年柱与流年干支生克为断，重命理生克。' },
    { key: 'minsu', name: '民俗仪轨', brief: '以拜太岁、安太岁、供品与时间仪轨为断，重民俗做法。' }
  ];

  function readPan() {
    var out = [];
    ['tsCheckOut', 'tsYearOut', 'tsFortuneOut'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
    });
    return out.join('\n\n').slice(0, 8000);
  }

  function mount() {
    if (typeof window.mountAI !== 'function' || window.__tsAiMounted) return;
    window.__tsAiMounted = true;
    window.mountAI(readPan, '太岁生肖', {
      systemPrompt: PROMPT,
      temperature: 0.3,
      schools: SCHOOLS,
      schoolLabel: '断法流派',
      schoolClosing: '每派段末写明本派判名、关键依据与对应神煞或干支。',
      schoolSummary: '三派成段后总收：先列共识、再列分歧，写明主判与取用。',
      share: { page: 'taisui', title: '太岁生肖在线查询' }
    });
  }

  if (document.readyState === 'complete') setTimeout(mount, 0);
  else window.addEventListener('load', function () { setTimeout(mount, 0); });
})();
