/* 阳宅风水 · AI 解析挂载
   统一走 ai.js 的 mountAI（与奇门/紫微同一套面板：流派、多轮追问、分享）。 */
(function () {
  'use strict';

  var FS_AI_PROMPT = [
    '本盘为阳宅风水（玄空飞星 + 八宅明镜 + 形法）。请严格依据盘面作答，按以下顺序组织：',
    '一、宅基：坐山向首、元运、流年，先说清本盘前提；',
    '二、飞星盘：山星/向星/运星的旺衰与组合，指出当令星落在哪宫；',
    '三、格局：旺山旺向（到山到向）、上山下水、双星到向、伏吟反吟、七星打劫等，成立与否须给判据；',
    '四、各宫要点：大门、主卧、厨房、卫生间所在宫位，逐宫说明吉凶与影响；',
    '五、八宅参考：宅卦、命卦、东西四宅与游年九星配合；',
    '六、建议：只给可操作项，移形易位（换床位、改门位、调整灶位）优先，其次遮挡缓冲；每条写明改哪里、怎么改、为什么；',
    '七、流年注意：五黄、太岁、三煞所在方位与该年宜忌；',
    '八、择日提示：涉及动土、入宅、安床时提示择日。',
    '输出格式：每一层或每一段之间空一行（两个换行），单段不超过五句，便于分段阅读；',
    '规则：兼向或空亡时必须说明本盘不确定、建议两盘并参，不得含糊带过；',
    '煞气名称用通行术语，并注明属常识性建议而非典籍规定；',
    '盘面证据不足时明说“盘面未给出”，不得自造格局或断语；',
    '涉及健康先提示就医，不夸大风水作用；末尾提示仅供传统文化研究参考。'
  ].join('\n');

  var FS_AI_SCHOOLS = [
    { key: 'xuankong', name: '玄空飞星', brief: '以山向飞星旺衰、到山到向、七星打劫与流年紫白为断，重理气。' },
    { key: 'bazhai', name: '八宅明镜', brief: '以宅卦命卦、游年九星、东西四宅配合为断，重人与宅的适配。' },
    { key: 'sanhe', name: '三合', brief: '以来龙、水口、三合六合方位为断，重形势与方位配合。' },
    { key: 'xingshi', name: '形势峦头', brief: '以门前道路、背后靠山、左右护卫与形煞为断，重外部环境。' }
  ];

  var LAYERS = [
    ['fsmod-l1', '第一层 定运'],
    ['fsmod-l2', '第二层 立向'],
    ['fsmod-l3', '第三层 定人'],
    ['fsmod-l4', '第四层 避煞'],
    ['fsmod-l5', '第五层 布局'],
    ['fsmod-final', '综合诊断']
  ];

  function unfilled() {
    var items = [];
    var els = document.querySelectorAll('.page-fs input[id], .page-fs select[id]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var v = String(el.value || '').trim();
      if (v && v !== '未选' && v !== '未知地' && v !== '-1') continue;
      var box = el.closest && el.closest('.field');
      var lab = box && box.querySelector('label');
      var name = lab ? lab.textContent.replace(/\s+/g, ' ').trim() : el.id;
      items.push(name + (v === '未选' ? '（未选）' : '（未填）'));
    }
    return items;
  }

  function readPan() {
    var out = [];
    LAYERS.forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (!el) return;
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) out.push('［' + pair[1] + '］' + t);
    });
    var miss = unfilled();
    if (miss.length) out.push('［尚未填写／按默认值处理］' + miss.slice(0, 24).join('、'));
    return out.join('\n\n').slice(0, 8000);
  }

  function mount() {
    if (typeof window.mountAI !== 'function' || window.__fsAiMounted) return;
    window.__fsAiMounted = true;
    window.mountAI(readPan, '阳宅风水', {
      systemPrompt: FS_AI_PROMPT,
      temperature: 0.3,
      schools: FS_AI_SCHOOLS,
      schoolLabel: '断宅流派',
      schoolClosing: '每派段末写明本派判名、关键依据与对应宫位，证据须落在盘面上。',
      schoolSummary: '四派成段后另起一段总收：先列共识、再列分歧，写明主判、次判与取用；不得把四派混成一句。',
      share: {
        page: 'fengshui',
        title: '阳宅风水在线排盘',
        recast: function () { try { if (typeof fsCalc === 'function') fsCalc(); } catch (e) {} }
      }
    });
  }

  if (document.readyState === 'complete') setTimeout(mount, 0);
  else window.addEventListener('load', function () { setTimeout(mount, 0); });
})();
