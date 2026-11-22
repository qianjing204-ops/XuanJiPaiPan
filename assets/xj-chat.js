/* 紫微、铁板、合婚、河洛、姓名共用的白话对话。
   只读各页已经排好的盘面，不重排、不改算法。对话只留在内存。 */
(function () {
  var PAGE = null;
  var RUN = null;
  var PHOTO = '';
  var CFG = null;
  var READY = false;

  var PAGES = {
    fengshui: {
      title: '阳宅 · 解析',
      who: '这套宅子',
      ask: '先讲这套宅子，不要逐层念表。用过日子的话说，按顺序写五段，每段三到五句：坐向与元运说明什么；当令旺星落在哪、能不能用上；大门、主卧、厨房、卫生间各有什么问题；有哪些煞要处理、先处理哪一个；今年要注意什么。段与段之间空一行（两个换行），每段自成一块。最后补一句：想细看哪一层，回到盘面点开。',
      placeholder: '接着问这套宅子',
      host: 'fsOpenChatHost',
      noSwipeDown: true,
      edgeBack: true,
      segment: true
    },
    ziwei: {
      title: '紫微 · 解析',
      who: '这个人',
      ask: '先讲这个人，不要拆大限，不要讲某一年。用过日子的话说。按顺序写五段，每段三到五句：这个人是什么样的；一辈子主要忙什么、钱从哪来、容易卡在哪；感情和家里人；身体上要留心什么，不下诊断；哪几步大限顺、哪几步要收着，每步只一句。最后补一句：想看细处，回到盘面。',
      placeholder: '接着问这个人',
      host: 'zwResultPage',
      hide: 'zwResultAi'
    },
    tieban: {
      title: '铁板 · 解析',
      who: '这个人',
      ask: '先讲这个人，不要逐条念条文，不要按大运展开，不要讲某一年。用过日子的话说。按顺序写五段，每段三到五句：这个人是什么样的；一辈子主要忙什么、钱从哪来、容易卡在哪；感情和家里人；身体上要留心什么，不下诊断；哪几步顺、哪几步要收着，每步只一句。最后补一句：条文只是底稿，正文用生活里的话。',
      placeholder: '接着问这个人',
      host: 'result-shell'
    },
    hehun: {
      title: '合婚 · 解析',
      who: '这两个人',
      ask: '先讲这两个人合不合适，不要拆成两份一生，不要讲某一年。用过日子的话说。按顺序写五段，每段三到五句：相处起来是什么样的两个人；一起过日子、钱和家里怎么磨；感情里顺的地方和容易拧的地方；住在一起要留心什么；综合下来宜不宜长久，给一句明白话。最后补一句：分数和术语只是底稿。',
      placeholder: '接着问这两个人',
      host: 'result-shell'
    },
    heluo: {
      title: '河洛 · 解析',
      who: '这个人',
      ask: '先讲这个人，不要按大运展开，不要讲所查的那一年、那一月。用过日子的话说。按顺序写五段，每段三到五句：先天禀赋是什么样的人；落到现实里主要忙什么、容易卡在哪；感情和家里人；身体上要留心什么，不下诊断；哪一段运顺、哪一段要收着，每段只一句。最后补一句：想看某一年，先在盘面点查运程。',
      placeholder: '接着问这个人',
      host: 'hlResultPage',
      hide: 'hlResultAi'
    },
    xingming: {
      title: '姓名 · 解析',
      who: '这个名字',
      ask: '先讲这个名字，或这一批名字，用过日子的话说，不要堆笔画和格名。若是一个人的姓名：写这个名字给人的感觉、做事和与人相处、宜不宜长期用，各三句。若是一批推荐：挑最靠前的三个，每个两句，说明为什么顺口、哪里要留意。若是联名：讲这两个名字放在一起像什么，不要评判单名吉凶。不下绝对断语。',
      placeholder: '接着问这个名字',
      host: 'result-shell'
    },
    xingzhan: {
      title: '占星 · 解析', who: '这个人',
      ask: '先讲这个人，不要拆行运，不要讲某一年。用过日子的话说。按顺序写五段，每段三到五句：这个人是什么样的；一辈子主要忙什么、钱从哪来、容易卡在哪；感情和家里人；身体上要留心什么，不下诊断；接下来适合把力气放在哪、哪一段要收着。最后补一句：想看细处，回到盘面。',
      placeholder: '接着问这个人', host: 'result-shell'
    },
    qizheng: {
      title: '七政 · 解析', who: '这个人',
      ask: '先讲这个人，不要拆大限，不要讲某一年。用过日子的话说。按顺序写五段，每段三到五句：这个人是什么样的；一辈子主要忙什么、钱从哪来、容易卡在哪；感情和家里人；身体上要留心什么，不下诊断；哪一段顺、哪一段要收着。最后补一句：想看细处，回到盘面。',
      placeholder: '接着问这个人', host: 'result-shell'
    },
    qimen: {
      title: '奇门 · 解析', who: '这件事',
      ask: '先断这一次所占的事，不要讲一辈子。用过日子的话说。先给一句明白结论，再写四段，每段三到四句：事情现在卡在哪、有什么助力；宜动还是宜等；人和方向上该注意什么；下一步可以做什么。最后补一句：局只断这一次。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    daliuren: {
      title: '大六壬 · 解析', who: '这件事',
      ask: '先断这一次所占的事，不要讲一辈子，不要逐条念课传。用过日子的话说。先给一句明白结论，再写四段，每段三到四句：事情从哪来；现在走到哪；对方或外头的因素；接下来怎么走。最后补一句：课只断这一次。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    taiyi: {
      title: '太乙 · 解析', who: '这件事',
      ask: '先断这一次所占的事，不要讲一辈子。用过日子的话说。先给一句明白结论，再写四段，每段三到四句：谁占先；助力在哪；阻力在哪；下一步宜进还是宜守。最后补一句：局只断这一次。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    liuyao: {
      title: '六爻 · 解析', who: '这件事',
      ask: '先断这一次所占的事，不要讲一辈子，不要逐爻念。用过日子的话说。先给一句明白结论，再写四段，每段三到四句：事情现在怎样；阻力在哪；助力在哪；接下来怎么变、该怎么做。最后补一句：卦只断这一次。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    meihua: {
      title: '梅花 · 解析', who: '这件事',
      ask: '先断这一次所占的事，不要讲一辈子。用过日子的话说。先给一句明白结论，再写四段，每段三到四句：事情现在怎样；里头和外头各是什么；接下来怎么变；下一步怎么做。最后补一句：卦只断这一次。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    zeri: {
      title: '择日 · 解析', who: '这几天',
      ask: '只讲页面上已经查出的这些日子，不另排、不改日子。用过日子的话说。先点出最靠前的三个日子，各用两句说明适合办什么、要避开什么。若是造命择时，只比较页面列出的前几个时辰，不讲一辈子。不下医疗断语，不保证一定成事。',
      placeholder: '接着问这几天', host: 'out', fill: true
    },
    huangji: {
      title: '皇极 · 解析', who: '这一年',
      ask: '只讲页面上已经推演的这一年，不另算、不改卦气。用过日子的话说。写三段：这一年处在什么样的大势里；对做事和收成意味着什么；哪些话只是历法位置，不要当成预言。不下绝对断语。',
      placeholder: '接着问这一年', host: 'out', fill: true
    },
    tarot: {
      title: '塔罗 · 解析', who: '这件事',
      ask: '只讲这一次抽出的牌和所问的事，不另抽、不讲一辈子。用过日子的话说。先给一句明白结论，再写四段：事情现在怎样；阻力在哪；助力在哪；下一步怎么做。牌名可以带一下，马上翻成生活里的话。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    lenormand: {
      title: '雷诺曼 · 解析', who: '这件事',
      ask: '只讲这一次抽出的牌和所问的事，不另抽、不讲一辈子。用过日子的话说。先给一句明白结论，再写四段：事情从哪来；现在走到哪；外头的因素；接下来怎么做。牌名可以带一下，马上翻成生活里的话。',
      placeholder: '接着问这件事', host: 'result-shell'
    },
    yunqi: {
      title: '五运六气 · 解析', who: '这一年',
      ask: '只讲页面上这一年的岁运和节气气候，不另排、不下诊断、不讲某个人的病。用过日子的话说。写三段：这一年气候大致怎样；哪几个节气要留意冷热和作息；哪些只是历法归纳，不能当成医嘱。',
      placeholder: '接着问这一年', host: 'yqYunOut', fill: true
    },
    lingqian: {
      title: '灵签 · 解签', who: '这支签',
      ask: '只解释页面上已经摇出的这支签和所求之事，不另起签，不改签文。用过日子的话说。先用两句讲这支签在说什么，再按所求写：眼前宜做什么、要避开什么。签文没有的话不编。最后补一句：这是签文的白话，不是另外一断。',
      placeholder: '接着问这支签', host: 'out'
    },
    zhougong: {
      title: '周公解梦 · 解析', who: '这个梦',
      ask: '只根据当前梦象和页面查到的原文做民俗解读。先说明原文的象征，再用现实生活的话给出可能的情绪提醒和可执行建议。明确这是传统文本参考，不把梦当成预言，不作医疗或现实断言。',
      placeholder: '接着问这个梦', host: 'zgOut'
    },
    shouxiang: {
      title: '手相 · 解析', who: '这只手', photo: true,
      ask: '请根据这张手相图，按《金锁银匙》《神相全编》的掌纹名目逐项看，用大白话分条写，每条三到五句，整体写足、不要只写性格。'
        + '先交代对照：天纹=感情线、人纹=智慧线、地纹=生命线、玉柱纹=事业线、婚姻线=小指根下横纹、子女线=婚姻线上方细纹；左右手以右手为主、左手为辅（左撇子反之）。'
        + '顺序：'
        + '一、手型掌质与整体气质（三十秒读完的那种第一印象）；'
        + '二、感情与姻缘（重点讲透）：婚姻线在小指根侧面，先报条数——一条深长为一段稳定姻缘，两三条主多段或曾有波折，四条以上而杂乱主情感反复；再看走向：末端上扬主早婚、平直主适中、下垂或分叉主晚婚或需经营；再看位置：靠近感情线主早、靠近小指根主晚；结合这三项给出大约几岁成婚、大概几段正经感情、配偶大概什么性情方向，并说清每条判断依据在掌上哪一处；'
        + '三、子女：子女线在婚姻线上方，细而竖的纹，先报条数——几条主几个子女，深浅主身体强弱，靠近小指端的一条主长子或长女；若有岛纹或断裂，说明这一胎需留意，只作提醒；'
        + '四、事业财运：事业线、太阳线、掌丘丰隆，说适合做什么、财从哪来；'
        + '五、特殊纹：岛纹、十字纹、三角纹、星纹各出现在哪条线上，按传统说法说明含义；'
        + '六、健康与心性：只作提醒，不当诊断；'
        + '七、近三五年宜忌：给两三条具体可做的，再补一句开运建议。'
        + '要求：按传统相法给明确判断（几段、几岁、几个），不要只说性格；确实看不清的部位就说明看不清、按能见到的推断，不要整段跳过。末尾一句注明这是传统民俗参照。',
      intro: '**看手相之前，先说几句**\n\n'
        + '**一、拍照注意事项**\n'
        + '· 手掌正面、五指自然张开，不要握拳\n'
        + '· 光线均匀，别开闪光灯，避免反光\n'
        + '· 掌纹要清楚，别用美颜、别加滤镜\n'
        + '· 婚姻线、子女线在小指根那一侧，最好再侧拍一张\n'
        + '· 一次只拍一只手；右手为主、左手为辅\n\n'
        + '**二、解析注意事项**\n'
        + '· 只按照片里看得见的纹路讲，看不清的会直说，不编\n'
        + '· 按《金锁银匙》《神相全编》的传统名目断，属坊间说法\n'
        + '· 看的是倾向，不是定数\n\n'
        + '**三、民俗参考**\n'
        + '· 相术属传统民俗文化，仅供文化研究与娱乐\n'
        + '· 同一只手，不同相书说法可能不同\n\n'
        + '**四、不做任何建议**\n'
        + '· 不构成医疗、婚恋、投资、法律等任何专业建议\n'
        + '· 身体不适请就医；重大决定请自行判断或咨询专业人士\n\n'
        + '照片只在本次对话中使用，不保存。拍好了就发过来。',
      introKey: 'intro-shouxiang',
      placeholder: '先写一句，或直接发图', host: 'sxShouOut', fill: true, noSwipeDown: true, edgeBack: true
    },
    mianxiang: {
      title: '面相 · 解析', who: '这张面', photo: true,
      ask: '请根据这张面相图，按《麻衣神相》《神相全编》的名目逐项看，用大白话分条写，每条三到五句，整体写足、不要只写性格。'
        + '先交代对照：三停——上停发际至眉、中停眉至鼻准、下停鼻准至颏；五官——眉为保寿官、眼为监察官、耳为采听官、鼻为审辨官、口为出纳官；脸型分金木水火土五形。'
        + '顺序：'
        + '一、三停比例与脸型五形，给整体气质与运势底色；'
        + '二、感情与姻缘（重点讲透）：看夫妻宫（眼尾）饱满或凹陷、明暗气色，眼形与眼神，鼻梁与鼻头，唇之厚薄与嘴角，据此给大概几段正缘、早婚还是晚婚、大约几岁成婚、配偶大概什么性情方向，并说清依据在脸上哪一处；'
        + '三、子女：看泪堂（眼下）饱满或凹陷、人中深浅长短、法令纹走向，说大概几个子女、偏男偏女；'
        + '四、事业财运：看额头官禄宫、鼻为财帛宫、颧骨与腮，说适合行业、财从哪来、宜守宜攻；'
        + '五、十二宫挑最显著的四处讲（命宫、财帛、田宅、福德等），每处一两句；'
        + '六、痣与纹：脸上的痣在哪个宫位、法令纹鱼尾纹抬头纹各主什么，按传统说法说明；'
        + '七、健康与心性：只作提醒，不当诊断；'
        + '八、近三五年宜忌：给两三条具体可做的，再补一句开运建议。'
        + '要求：按传统相法给明确判断（几段、几岁、几个），不要只说性格；确实看不清的部位就说明看不清、按能见到的推断，不要整段跳过。末尾一句注明这是传统民俗参照。',
      intro: '**看面相之前，先说几句**\n\n'
        + '**一、拍照注意事项**\n'
        + '· 正面平视镜头，别仰拍俯拍\n'
        + '· 摘掉帽子口罩墨镜，刘海别遮额头，头发最好扎起露出耳朵\n'
        + '· 光线均匀，自然光最好，别开闪光灯\n'
        + '· 素颜更准，别用美颜、别加滤镜，修图会影响判断\n'
        + '· 一次一张，正面为主；想细看侧面可再补一张\n\n'
        + '**二、解析注意事项**\n'
        + '· 只看照片里看得清的五官轮廓与气色，看不清的会直说，不编\n'
        + '· 按《麻衣神相》《神相全编》的传统名目断，属坊间说法\n'
        + '· 面相看的是倾向，不是定数\n\n'
        + '**三、民俗参考**\n'
        + '· 相术属传统民俗文化，仅供文化研究与娱乐\n'
        + '· 同一张脸，不同相书说法可能不同\n\n'
        + '**四、不做任何建议**\n'
        + '· 不构成医疗、婚恋、投资、法律等任何专业建议\n'
        + '· 身体不适请就医；重大决定请自行判断或咨询专业人士\n\n'
        + '照片只在本次对话中使用，不保存。准备好了就发过来。',
      placeholder: '先写一句，或直接发图', host: 'mianOut', fill: true,
      noSwipeDown: true, edgeBack: true
    }
  };

  var SYS = [
    '你在跟一个不懂命理的人说话，只解当前这一盘。',
    '盘面里的星曜、宫位、四化、条文、卦名、爻位、十神、神煞、纳音、五格、三才是给你核对的底稿，不是给读者看的。不要重排，也不要否定底稿。底稿没有的数字、年份、人名不编。',
    '读者看到的话里不要出现这些词：十神名、神煞名、纳音、十二长生、格局、用神、忌神、扶抑、调候、旺衰评分、四化名、宫干飞星、五格名、三才、数理吉凶。星名、卦名、干支只在不得不用时带一下，马上用一句生活里的话翻过来。',
    '按这个人怎么过日子来写：性格、做事、钱、感情、家里、身体上要留心的倾向。不下医疗诊断，不给投资建议。避免绝对化。',
    '所问超出本盘时，说明这一盘还没含那一层，不要编。末尾写明仅供参考。'
  ].join('\n');
  var PLAIN = '即便上面附了流派要求，对读者仍用大白话。派名和术语留在你自己的判断里，不要铺到正文。';

  function $(id) { return document.documentElement ? document.getElementById(id) : null; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function pageName() {
    var p = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    return PAGES[p] ? p : '';
  }
  function cfg() {
    if (CFG) return CFG;
    CFG = PAGES[pageName()] || null;
    return CFG;
  }

  function contextText() {
    try {
      var fn = window.__aiGetContext;
      var t = fn ? fn() : '';
      return String(t || '').trim();
    } catch (e) { return ''; }
  }
  function ready() {
    var t = contextText();
    if (!t) return false;
    if (t === '尚未排盘。') return false;
    return true;
  }
  function digest() {
    var t = contextText().split('\n').map(function (s) { return s.trim(); }).filter(Boolean)[0] || '';
    return t.length > 42 ? t.slice(0, 42) + '…' : t;
  }
  function schoolExtra() {
    if (typeof aiSchoolPrompt === 'function') {
      try { return aiSchoolPrompt(); } catch (e) { return ''; }
    }
    return '';
  }
  function models() {
    try {
      var all = (typeof aiModels === 'function') ? aiModels() : [];
      return all.filter(function (m) { return m && m.enabled !== false && m.baseUrl && m.apiKey && m.model; });
    } catch (e) { return []; }
  }

  /* 配置解密是异步的：首次点开等最多 2 秒，别直接落“没有模型” */
  function ensureModels() {
    var first = models();
    if (first.length) return Promise.resolve(first);
    return new Promise(function (resolve) {
      var n = 0;
      var timer = setInterval(function () {
        var list = models();
        if (list.length || ++n >= 10) { clearInterval(timer); resolve(list); }
      }, 200);
    });
  }

  function css() {
    return [
      '#xjChat{position:fixed;inset:0;z-index:2147482000;display:none;flex-direction:column;overflow:hidden;background:#F7F7F7;color:#111;',
      'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC",sans-serif;overscroll-behavior:contain}',
      '#xjChat.xj-on{display:flex}',
      '#xjChat *{box-sizing:border-box}',
      '#xjChat .xj-bar{display:flex;align-items:center;gap:0;flex:none;min-height:50px;padding:0 4px;padding-top:env(safe-area-inset-top);background:rgba(247,247,247,.98);border-bottom:.5px solid #E5E5EA}',
      '#xjChat .xj-bar button{display:flex;align-items:center;justify-content:center;min-width:38px;height:38px;border:0;border-radius:8px;background:transparent;color:#2F6F5B;font-size:20px;line-height:1;padding:0 6px}',
      '#xjChat .xj-bar button:active{background:rgba(47,111,91,.08)}',
      '#xjChat .xj-bar #xjMore{color:#333;font-size:18px}',
      '#xjChat .xj-bar .ttl{flex:1;min-width:0;text-align:center;line-height:1.15}',
      '#xjChat .xj-bar .ttl b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;font-weight:600;color:#111}',
      '#xjChat .xj-bar .ttl span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:#999;margin-top:3px}',
      '#xjChat .msgs{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:10px 14px 18px}',
      '#xjChat .sys-pill{display:flex;align-items:center;gap:6px;width:fit-content;max-width:92%;margin:2px auto 14px;padding:5px 11px;border-radius:12px;background:#E9E9E9;color:#6B6B6B;font-size:12px;line-height:1.25}',
      '#xjChat .sys-pill span{flex:none;opacity:.75}',
      '#xjChat .sys-pill b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:#4A4A4A}',
      '#xjChat .onboard{max-width:300px;margin:26px auto 0;padding:20px 18px;border-radius:14px;background:#fff;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.04)}',
      '#xjChat .onboard .ob-badge{width:44px;height:44px;margin:0 auto 10px;border-radius:12px;background:#2F6F5B;color:#fff;font-size:15px;font-weight:700;line-height:44px}',
      '#xjChat .onboard .ob-t{font-size:16px;font-weight:600;color:#111}',
      '#xjChat .onboard .ob-s{font-size:13px;color:#8A8A8E;line-height:1.5;margin:6px 0 14px}',
      '#xjChat .onboard .ob-b{width:100%;height:40px;border:0;border-radius:10px;background:#2F6F5B;color:#fff;font-size:15px}',
      'html[data-theme="dark"] #xjChat .onboard{background:#1C1C1E}',
      'html[data-theme="dark"] #xjChat .onboard .ob-t{color:#EDEDED}',
      '#xjChat .time{text-align:center;font-size:11px;color:#9A9A9A;margin:10px 0 6px}',
      '#xjChat .row{display:flex;align-items:flex-start;gap:8px;margin:12px 0}',
      '#xjChat .row.me{justify-content:flex-end}',
      '#xjChat .ava{flex:none;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#fff;background:#2F6F5B;user-select:none}',
      '#xjChat .ava.me{background:#5C7A70}',
      '#xjChat .bub{position:relative;max-width:72%;padding:9px 12px;border-radius:8px;font-size:15px;line-height:1.55;white-space:pre-wrap;word-break:break-word;background:#fff;color:#111;box-shadow:0 1px 1px rgba(0,0,0,.03)}',
      '#xjChat .row.me .bub{background:#2F6F5B;color:#fff}',
      '#xjChat .bub:before{content:"";position:absolute;top:11px;left:-5px;border:5px solid transparent;border-right-color:#fff}',
      '#xjChat .row.me .bub:before{left:auto;right:-5px;border-right-color:transparent;border-left-color:#2F6F5B}',
      '#xjChat .bub.err{background:#FFF1F0;color:#B84A3A}',
      '#xjChat .row.me .bub.err{background:#FBE3E0;color:#8C2F22}',
      '#xjChat .bub.err:before{border-right-color:#FFF1F0}',
      '#xjChat .row.me .bub.err:before{border-left-color:#FBE3E0;border-right-color:transparent}',
      '#xjChat .bub .retry{display:inline-block;margin-top:8px;padding:4px 12px;border:1px solid currentColor;border-radius:14px;background:transparent;color:inherit;font-size:13px}',
      '#xjChat .wait{color:#8E8E93}',
      '#xjChat .dots::after{content:"";animation:xjDots 1.2s steps(4,end) infinite}',
      '@keyframes xjDots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}100%{content:""}}',
      '@media (prefers-reduced-motion:reduce){#xjChat .dots::after{content:"...";animation:none}}',
      '#xjChat .bar{display:flex;align-items:center;gap:8px;flex:none;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:#fff;border-top:.5px solid #E5E5EA}',
      '#xjChat #xjPic{display:flex;align-items:center;justify-content:center;flex:none;width:34px;height:34px;border:0;border-radius:17px;background:#F2F2F2;color:#2F6F5B;font-size:22px;line-height:34px;padding:0}',
      '#xjChat textarea{flex:1;min-width:0;width:auto;height:38px!important;min-height:38px!important;max-height:96px;border:1px solid #E5E5EA!important;border-radius:19px!important;background:#F2F2F2!important;color:#111!important;font-size:16px!important;line-height:20px!important;padding:8px 12px!important;margin:0!important;resize:none!important;font-family:inherit!important;box-shadow:none!important;-webkit-appearance:none}',
      '#xjChat textarea:focus{outline:none!important;border-color:#2F6F5B!important}',
      '#xjChat textarea:disabled{opacity:.45}',
      '#xjChat .send{flex:none;width:38px!important;height:38px!important;border:0!important;border-radius:19px!important;background:#2F6F5B!important;color:#fff!important;font-size:17px!important;line-height:38px!important;text-align:center;padding:0!important}',
      '#xjChat .send[disabled]{opacity:.35}',
      '#xjChat #xjDown{position:absolute;right:14px;bottom:calc(64px + env(safe-area-inset-bottom));z-index:3;width:40px;height:40px;border:0;border-radius:20px;background:rgba(0,0,0,.5);color:#fff;font-size:16px;line-height:40px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,.18)}',
      '#xjChat #xjPick{position:absolute;left:12px;right:12px;bottom:calc(62px + env(safe-area-inset-bottom));z-index:8;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,.16)}',
      '#xjChat #xjPick button{display:block;width:100%;height:50px;border:0;border-bottom:1px solid #EEE;background:#fff;color:#111;font-size:16px;text-align:center}',
      '#xjChat #xjPick button:last-child{border-bottom:0;color:#888}',
      '#xjChat .sheet{position:absolute;left:0;right:0;bottom:0;z-index:6;display:block!important;overflow:auto;background:#F7F7F7;border-radius:14px 14px 0 0;padding:8px 16px calc(16px + env(safe-area-inset-bottom));max-height:78%}',
      '#xjChat .mask{position:absolute;inset:0;z-index:5;display:block!important;background:rgba(0,0,0,.4)}',
      '#xjChat .grab{width:36px;height:4px;border-radius:2px;background:#C7C7CC;margin:6px auto 12px}',
      '#xjChat .sheet button{display:block!important;width:100%;min-height:44px;text-align:left;border:0;background:transparent;color:#111;font-size:16px;padding:12px 0}',
      '#xjChat .sheet button.danger{color:#B84A3A}',
      '#xjChat .grp{font-size:12px;color:#8E8E93;margin-top:8px}',
      'html[data-theme="dark"] #xjChat{background:#111;color:#EDEDED}',
      'html[data-theme="dark"] #xjChat .xj-bar,html[data-theme="dark"] #xjChat .msgs{background:#111;border-color:rgba(255,255,255,.08)}',
      'html[data-theme="dark"] #xjChat .xj-bar .ttl b{color:#EDEDED}',
      'html[data-theme="dark"] #xjChat .xj-bar #xjMore{color:#EDEDED}',
      'html[data-theme="dark"] #xjChat .sys-pill{background:#242426;color:#9A9A9A}',
      'html[data-theme="dark"] #xjChat .sys-pill b{color:#BDBDBD}',
      'html[data-theme="dark"] #xjChat .bub{background:#2A2A2C;color:#EDEDED}',
      'html[data-theme="dark"] #xjChat .bub:before{border-right-color:#2A2A2C}',
      'html[data-theme="dark"] #xjChat .row.me .bub{background:#2F6F5B;color:#fff}',
      'html[data-theme="dark"] #xjChat .row.me .bub:before{border-left-color:#2F6F5B;border-right-color:transparent}',
      'html[data-theme="dark"] #xjChat .bar{background:#1C1C1E;border-color:rgba(255,255,255,.08)}',
      'html[data-theme="dark"] #xjChat textarea{background:#2A2A2C!important;border-color:#3A3A3C!important;color:#EDEDED!important}',
      'html[data-theme="dark"] #xjChat #xjPic{background:#2A2A2C;color:#7DCFB0}',
      'html[data-theme="dark"] #xjChat .sheet,html[data-theme="dark"] #xjChat #xjPick{background:#1C1C1E}',
      'html[data-theme="dark"] #xjChat .sheet button,html[data-theme="dark"] #xjChat #xjPick button{color:#EDEDED;background:transparent;border-color:#333}',
      '@media (prefers-color-scheme:dark){#xjChat{background:#F7F3EA;color:#1F2420}#xjChat .xj-bar,#xjChat .msgs{background:#F7F3EA}#xjChat .bub{background:#FCF9F2;color:#1F2420;box-shadow:0 1px 2px rgba(40,52,40,.06)}#xjChat .bar{background:#FCF9F2}#xjChat textarea{background:#FFFDF8!important;color:#1F2420!important}}',
      '@media (min-width:560px){#xjChat .msgs{padding-left:max(14px,calc((100% - 520px)/2));padding-right:max(14px,calc((100% - 520px)/2))}}',
      '#xjChat .menu-sheet{position:absolute;left:8px;right:8px;bottom:8px;max-height:82%;overflow:auto;background:#F7F7F7;border-radius:14px;padding:6px 10px calc(10px + env(safe-area-inset-bottom));box-shadow:0 10px 34px rgba(0,0,0,.22);animation:xjSheet .2s ease-out}',
      '@keyframes xjSheet{from{transform:translateY(18px);opacity:.6}to{transform:none;opacity:1}}',
      '#xjChat .menu-grp{font-size:12px;color:#8E8E93;margin:12px 8px 6px}',
      '#xjChat .menu-row{display:flex!important;align-items:center;gap:10px;width:100%!important;min-height:50px;padding:0 12px!important;margin:0 0 6px!important;border:0!important;border-radius:10px;background:#fff!important;color:#111!important;font-size:16px!important;text-align:left!important;line-height:normal!important}',
      '#xjChat .menu-row:active{background:#EAEAEC}',
      '#xjChat .menu-row .menu-t{flex:1 1 auto!important;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block!important}',
      '#xjChat .menu-row .menu-d{margin-left:auto!important;flex:0 0 auto!important;font-style:normal;font-size:12px;color:#9A9A9A;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block!important}',
      '#xjChat .menu-row .menu-arrow{flex:none;margin-left:4px;font-style:normal;color:#C4C4C6;font-size:18px}',
      '#xjChat .menu-row.danger .menu-t{color:#B84A3A}',
      '#xjChat .menu-cancel{display:block;width:100%;height:50px;margin-top:8px;border:0;border-radius:10px;background:#fff;color:#2F6F5B;font-size:16px;font-weight:600}',
      '#xjChat #xjMask .menu-row{display:flex!important;align-items:center!important;gap:10px!important;width:100%!important;min-height:50px!important;padding:0 12px!important;margin:0 0 6px!important;border:0!important;border-radius:10px!important;background:#fff!important;color:#111!important;font-size:16px!important;text-align:left!important}',
      '#xjChat #xjMask .menu-cancel{display:block!important;width:100%!important;height:50px!important;margin-top:8px!important;border:0!important;border-radius:10px!important;background:#fff!important;color:#2F6F5B!important;font-size:16px!important;font-weight:600!important}',
      'html[data-theme="dark"] #xjChat #xjMask .menu-row{background:#2A2A2C!important;color:#EDEDED!important}',
      'html[data-theme="dark"] #xjChat #xjMask .menu-cancel{background:#2A2A2C!important;color:#7DCFB0!important}',
      '#xjChat .cfg-mask{position:fixed;inset:0;z-index:2147483000;background:#F2F2F7;overflow:auto}',
      '#xjChat .cfg-page{max-width:560px;margin:0 auto;padding:calc(6px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom))}',
      '#xjChat .cfg-head{display:flex;align-items:center;min-height:48px}',
      '#xjChat .cfg-head button{width:44px;height:44px;border:0;background:transparent;color:#2F6F5B;font-size:24px;line-height:44px;padding:0}',
      '#xjChat .cfg-head b{flex:1;text-align:center;font-size:17px;font-weight:600}',
      '#xjChat .cfg-head span{width:44px}',
      '#xjChat .cfg-note{margin:6px 0 14px;font-size:13px;line-height:1.5;color:#8A8A8E}',
      '#xjChat .cfg-card{background:#fff;border-radius:14px;padding:14px;box-shadow:0 1px 2px rgba(0,0,0,.04)}',
      '#xjChat .cfg-label{display:block;font-size:12px;color:#8A8A8E;margin:10px 2px 6px}',
      '#xjChat .cfg-label:first-child{margin-top:0}',
      '#xjChat .cfg-input{display:block;width:100%;height:44px;border:1px solid #E5E5EA!important;border-radius:10px!important;background:#F7F7F7!important;color:#111!important;font-size:16px!important;padding:0 12px!important;margin:0!important;-webkit-appearance:none}',
      '#xjChat .cfg-input:focus{outline:none!important;border-color:#2F6F5B!important;background:#fff!important}',
      '#xjChat .cfg-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}',
      '#xjChat .cfg-actions button{height:46px;border-radius:10px;border:0;font-size:15px;font-weight:600}',
      '#xjChat #xjSave{background:#2F6F5B;color:#fff}',
      '#xjChat #xjTest{background:#fff;color:#2F6F5B;border:1px solid #2F6F5B}',
      '#xjChat .cfg-msg{min-height:20px;margin-top:10px;font-size:13px;color:#8A8A8E}',
      '#xjChat .cfg-list-title{display:flex;justify-content:space-between;align-items:center;margin:20px 2px 8px;font-size:13px;color:#8A8A8E}',
      '#xjChat .cfg-list-title span{font-size:12px}',
      '#xjChat .cfg-item{display:flex;align-items:center;gap:10px;background:#fff;border-radius:12px;padding:12px;margin-bottom:8px}',
      '#xjChat .cfg-item-main{flex:1;min-width:0}',
      '#xjChat .cfg-item-main b{display:block;font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#xjChat .cfg-item-main span{display:block;font-size:12px;color:#9A9A9A;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#xjChat .cfg-switch{flex:none;width:46px;height:28px;border:0;border-radius:14px;background:#D9D9DE;position:relative;padding:0}',
      '#xjChat .cfg-switch i{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:11px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .15s}',
      '#xjChat .cfg-switch.on{background:#2F6F5B}',
      '#xjChat .cfg-switch.on i{left:21px}',
      '#xjChat .cfg-del{flex:none;border:0;background:transparent;color:#B84A3A;font-size:13px;padding:6px}',
      '#xjChat .cfg-empty{padding:16px;text-align:center;color:#9A9A9A;font-size:13px;background:#fff;border-radius:12px}',
      'html[data-theme="dark"] #xjChat .menu-sheet{background:#1C1C1E}',
      'html[data-theme="dark"] #xjChat .menu-row,html[data-theme="dark"] #xjChat .menu-cancel{background:#2A2A2C;color:#EDEDED}',
      'html[data-theme="dark"] #xjChat .menu-row:active{background:#333}',
      'html[data-theme="dark"] #xjChat .cfg-mask{background:#111}',
      'html[data-theme="dark"] #xjChat .cfg-card,html[data-theme="dark"] #xjChat .cfg-item{background:#1C1C1E}',
      'html[data-theme="dark"] #xjChat .cfg-input{background:#2A2A2C!important;border-color:#3A3A3C!important;color:#EDEDED!important}',
      'html[data-theme="dark"] #xjChat .cfg-item-main b{color:#EDEDED}',
      'html[data-theme="dark"] #xjChat .cfg-switch{background:#3A3A3C}',
      'html[data-theme="dark"] #xjChat .cfg-switch.on{background:#2F6F5B}',

      '#aiCfgMask.modal-mask.show{display:block!important;position:absolute!important;inset:0!important;z-index:40!important;overflow:auto!important;background:#F2F2F7!important;padding:0!important}',
      '#aiCfgMask .modal.ai-cfg{display:block!important;width:100%!important;max-width:none!important;height:auto!important;min-height:100%!important;margin:0!important;border-radius:0!important;box-shadow:none!important;background:#F2F2F7!important;overflow:visible!important}',
      '#aiCfgMask .ai-cfg-head{position:sticky!important;top:0!important;z-index:5!important;display:block!important;padding:calc(10px + env(safe-area-inset-top)) 16px 12px!important;background:#1c1a17!important}',
      '#aiCfgMask #xjCfgBack{position:relative!important;z-index:8!important;display:flex!important;align-items:center!important;justify-content:center!important;min-width:64px!important;height:44px!important;margin:0 0 4px auto!important;padding:0 8px!important;border:0!important;background:transparent!important;color:#f0ece0!important;font-size:17px!important;line-height:44px!important;pointer-events:auto!important}',
      '#aiCfgMask .ai-cfg-head > .close{display:none!important}',
      '#aiCfgMask .ai-form,#aiCfgMask .ai-sec,#aiCfgMask .ai-form .row{display:block!important;width:100%!important}',
      '#aiCfgMask .ai-form label,#aiCfgMask .ai-form input,#aiCfgMask .ai-form select{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}',
      '#aiCfgMask .ai-form input,#aiCfgMask .ai-form select{height:44px!important;margin:6px 0 12px!important;border-radius:12px!important;font-size:16px!important}',
      '#aiCfgMask .ai-form .row button,#aiCfgMask .ai-enc button,#aiCfgMask .ai-actions button,#aiCfgMask .ai-model-del{display:block!important;width:100%!important;height:44px!important;margin:0 0 8px!important;border-radius:12px!important;position:static!important;float:none!important}',
      '#aiCfgMask .ai-sec{padding:16px!important}',
      '#aiCfgMask .ai-actions{display:block!important;margin:0!important;padding:0 16px 24px!important}',
      'html.embed #xjChat.xj-on{display:flex!important;flex-direction:column!important}',
      'html.embed #xjChat .xj-bar,html.embed #xjChat .xj-bar button{display:flex!important}',
      'html.ios-skin.ios-skin #xjChat .xj-bar{display:flex!important;position:relative!important;margin:0!important}',
      '#xjChat .card .v{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '#xjChat .wait{color:#8E8E93}',
      '#xjChat .dots::after{content:"";animation:xjDots 1.2s steps(4,end) infinite}',
      '@keyframes xjDots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}100%{content:""}}',
      '@media (prefers-reduced-motion:reduce){#xjChat .dots::after{content:"...";animation:none}}',
      '#xjChat .sheet{position:absolute;left:0;right:0;bottom:0;z-index:6;display:block!important;overflow:auto;background:#fff;border-radius:16px 16px 0 0;padding:8px 16px calc(16px + env(safe-area-inset-bottom));max-height:78%}',
      '@media (prefers-color-scheme:dark){#xjChat .sheet{background:#FCF9F2}}',
      '#xjChat .mask{position:absolute;inset:0;z-index:5;display:block!important;background:rgba(0,0,0,.4)}',
      '#xjChat .grab{width:36px;height:4px;border-radius:2px;background:#C7C7CC;margin:6px auto 12px}',
      '#xjChat .sheet button{display:block!important;width:100%;min-height:44px;text-align:left;border:0;background:transparent;color:#1C1C1E;font-size:16px;padding:12px 0}',
      '@media (prefers-color-scheme:dark){#xjChat .sheet button{color:#1F2420}}',
      '#xjChat .sheet button.danger{color:#B84A3A}',
      '#xjChat .grp{font-size:12px;color:#8E8E93;margin-top:8px}',
      '@media (prefers-reduced-motion:no-preference){#xjChat .row{animation:xjIn .18s ease-out}',
      '@keyframes xjIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}',
      'html.ios-skin.ios-skin #xjChat .row{animation:xjIn .18s ease-out!important}',
      '@media (prefers-reduced-motion:reduce){html.ios-skin.ios-skin #xjChat .row{animation:none!important}}',
      '/* dock style sits next to the button */'
    ].join('');
  }

  function raiseConfig() {
    var mask = document.getElementById('aiCfgMask');
    var chat = $('xjChat');
    if (!mask) return;
    if (chat && mask.parentNode !== chat) chat.appendChild(mask);
    mask.style.cssText = 'display:block;position:absolute;inset:0;z-index:40;overflow:auto;background:#F2F2F7;padding:0';
  }
  function fixConfigClose() {
    var head = document.querySelector('#aiCfgMask .ai-cfg-head');
    if (!head || document.getElementById('xjCfgBack')) return;
    var back = document.createElement('button');
    back.type = 'button';
    back.id = 'xjCfgBack';
    back.textContent = '返回';
    back.onclick = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var mask = document.getElementById('aiCfgMask');
      if (mask) { mask.classList.remove('show'); mask.style.display = 'none'; }
    };
    head.insertBefore(back, head.firstChild);
  }
  function ensure() {
    if ($('xjChat')) return;
    var c = cfg();
    var el = document.createElement('div');
    el.id = 'xjChat';
    el.hidden = true;
    el.innerHTML = '<style>' + css() + '</style>'
      + '<div class="xj-bar"><button type="button" id="xjBack" aria-label="返回盘面">‹</button><div class="ttl"><b id="xjTitle"></b><span id="xjSub"></span></div><button type="button" id="xjCfg" aria-label="解析配置">⚙</button><button type="button" id="xjMore" aria-label="更多">···</button></div>'
      + '<div class="msgs" id="xjMsgs"></div>'
      + '<button type="button" id="xjDown" hidden aria-label="回到底部">↓</button>'
      + '<div class="bar"><button type="button" id="xjPic" hidden>+</button><input id="xjAlbum" type="file" accept="image/*" hidden style="position:absolute;left:-9999px"><input id="xjCamera" type="file" accept="image/*" capture="environment" hidden style="position:absolute;left:-9999px"><textarea id="xjQ" rows="1"></textarea><button type="button" class="send" id="xjSend">↑</button></div>';
    document.body.appendChild(el);
    $('xjTitle').textContent = c.title;
    $('xjQ').placeholder = c.placeholder;
    $('xjBack').onclick = close;
    $('xjCfg').onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openConfig();
      return;
      tip('请回掐指三断外壳后再点配置');
    };
    if (c.photo) {
      $('xjPic').hidden = false;
      $('xjPic').onclick = pickPhoto;
      $('xjAlbum').onchange = function () { onPhoto('xjAlbum'); };
      $('xjCamera').onchange = function () { onPhoto('xjCamera'); };
    }
    var more=$('xjMore');
    more.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (document.getElementById('xjMask')) return; // 防连点重复开
      openSheet();
    };
    $('xjSend').onclick = onSend;
    var xjComposing = false;
    $('xjQ').addEventListener('compositionstart', function () { xjComposing = true; });
    $('xjQ').addEventListener('compositionend', function () { xjComposing = false; });
    $('xjQ').addEventListener('keydown', function (e) {
      /* 中文输入法选词时回车只上屏，不发消息 */
      if (e.isComposing || xjComposing || e.keyCode === 229) return;
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
    });
    $('xjQ').addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 96) + 'px';
    });
    var msgsEl = $('xjMsgs');
    if (msgsEl) msgsEl.addEventListener('scroll', updateDown, { passive: true });
    var downEl = $('xjDown');
    if (downEl) downEl.onclick = function () {
      var h = $('xjMsgs');
      if (h) h.scrollTop = h.scrollHeight;
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', fitViewport);
      window.visualViewport.addEventListener('scroll', fitViewport);
    }
    var __gestureCfg = cfg();
    if (__gestureCfg && __gestureCfg.noSwipeDown) bindEdgeBack(); else bindSwipeClose();
  }

  function fitViewport() {
    var el = $('xjChat');
    if (!el || el.hidden) return;
    var vv = window.visualViewport;
    var shrunk = vv && (window.innerHeight - vv.height) > 80;
    if (shrunk) {
      el.style.height = vv.height + 'px';
      el.style.top = vv.offsetTop + 'px';
      el.style.bottom = 'auto';
    } else {
      el.style.height = '';
      el.style.top = '';
      el.style.bottom = '0';
    }
  }
  function resetViewport() {
    var el = $('xjChat');
    if (!el) return;
    el.style.height = '';
    el.style.top = '';
    el.style.bottom = '';
  }
  function xjSpring(el, from, to, velocity, onDone) {
    if (el.__xjSpring) cancelAnimationFrame(el.__xjSpring);
    var x = from, v = velocity || 0, last = performance.now();
    var response = 0.35, zeta = 1.0, w = 2 * Math.PI / response;
    function frame(now) {
      var dt = Math.min(0.064, Math.max(0.001, (now - last) / 1000));
      last = now;
      var a = -w * w * (x - to) - 2 * zeta * w * v;
      v += a * dt;
      x += v * dt;
      if (Math.abs(x - to) < 0.5 && Math.abs(v) < 8) {
        el.style.transform = to === 0 ? '' : 'translateY(' + to + 'px)';
        el.__xjSpring = null;
        if (onDone) onDone();
        return;
      }
      el.style.transform = 'translateY(' + x + 'px)';
      el.__xjSpring = requestAnimationFrame(frame);
    }
    el.__xjSpring = requestAnimationFrame(frame);
  }
  function bindEdgeBack() {
    var el = $('xjChat');
    if (!el || el.__xjEdge) return;
    el.__xjEdge = true;
    var sx = 0, sy = 0, active = false;
    function begin(x, y) { active = true; sx = x; sy = y; }
    function finish() { active = false; }
    /* 左缘起手：先拦掉 iOS/WebView 的系统右滑返回，避免把页面退回上一页 */
    el.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0];
      if (!t) return;
      if (t.clientX > 30) return;
      begin(t.clientX, t.clientY);
      try { e.preventDefault(); } catch (err) {}
    }, { passive: false });
    el.addEventListener('touchmove', function (e) {
      if (!active) return;
      var t = e.touches && e.touches[0];
      if (!t) return;
      var dx = t.clientX - sx, dy = Math.abs(t.clientY - sy);
      if (dx > 4) { try { e.preventDefault(); } catch (err) {} }
      if (dx > 70 && dy < 60) { finish(); try { close(); } catch (err) {} }
    }, { passive: false });
    el.addEventListener('touchend', finish, { passive: true });
    el.addEventListener('touchcancel', finish, { passive: true });
    /* 桌面/指针设备同样支持 */
    el.addEventListener('pointerdown', function (e) {
      if (e.clientX > 28) return;
      begin(e.clientX, e.clientY);
    }, { passive: true });
    el.addEventListener('pointermove', function (e) {
      if (!active) return;
      var dx = e.clientX - sx, dy = Math.abs(e.clientY - sy);
      if (dx > 70 && dy < 60) { finish(); try { close(); } catch (err) {} }
    }, { passive: true });
    el.addEventListener('pointerup', finish, { passive: true });
    el.addEventListener('pointercancel', finish, { passive: true });
  }
  function bindSwipeClose() {
    var el = $('xjChat');
    if (!el || el.__xjSwipe) return;
    el.__xjSwipe = true;
    var startY = 0, startX = 0, lastY = 0, lastT = 0, v = 0, dragging = false;
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('button,input,textarea,select')) return;
      if (el.scrollTop > 0) return;
      dragging = true;
      startY = lastY = e.clientY;
      startX = e.clientX;
      lastT = performance.now();
      v = 0;
      el.style.transition = 'none';
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    }
    function onMove(e) {
      if (!dragging) return;
      var dy = e.clientY - startY;
      var dx = e.clientX - startX;
      if (dy < 0) dy = 0;
      if (Math.abs(dx) > Math.abs(dy) && dy < 8) return;
      var now = performance.now();
      v = (e.clientY - lastY) / Math.max(1, now - lastT) * 1000;
      lastY = e.clientY;
      lastT = now;
      el.style.transform = 'translateY(' + dy + 'px)';
      el.style.opacity = String(Math.max(0.55, 1 - dy / 900));
      e.preventDefault();
      e.stopPropagation();
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      var m = /translateY\(([-0-9.]+)px\)/.exec(el.style.transform || '');
      var dy = m ? parseFloat(m[1]) : 0;
      var projected = dy + (v / 1000) * 0.998 / (1 - 0.998);
      var closeNow = projected > 160 || v > 900;
      if (closeNow) {
        xjSpring(el, dy, window.innerHeight, v, function () {
          el.style.transform = '';
          el.style.opacity = '';
          close();
        });
      } else {
        xjSpring(el, dy, 0, v, function () {
          el.style.opacity = '';
        });
      }
      v = 0;
    }
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  }

  var __xjPushed = false, __xjFromPop = false;
  window.addEventListener('popstate', function () {
    if (!__xjPushed) return;
    __xjPushed = false; __xjFromPop = true;
    try { close(); } catch (e) {}
    __xjFromPop = false;
  });
  function open() {
    hideLegacy();
    mountButton();
    if (!ready() && !(cfg() && cfg().photo)) { alert('请先完成排盘再进行 AI 解析'); return; }
    ensure();
    var anchor = contextText().slice(0, 240);
    if (!PAGE || PAGE.anchor !== anchor) {
      PAGE = { msgs: [], anchor: anchor };
    }
    $('xjSub').textContent = digest();
    $('xjChat').hidden = false;
    $('xjChat').classList.add('xj-on');
    $('xjChat').style.transform = '';
    $('xjChat').style.opacity = '';
    document.body.style.overflow = 'hidden';
    if (!__xjPushed) {
      try { history.pushState({ xjChat: 1 }, ''); __xjPushed = true; } catch (e) {}
    }
    fitViewport();
    renderMsgs();
    if (cfg().intro && !PAGE.msgs.length) {
      PAGE.msgs.push({ role: 'assistant', text: cfg().intro, intro: true, ts: Date.now() });
      renderMsgs();
    }
    if (cfg().photo) {
      if (!PHOTO) {
        try { PHOTO = sessionStorage.getItem('xj-photo-' + pageName()) || ''; } catch (e) {}
      }
      $('xjPic').hidden = false;
      $('xjQ').disabled = false;
      $('xjQ').placeholder = PHOTO ? '可以先写一句，再点发送' : cfg().placeholder;
      renderMsgs();
      return;
    }
    if (!PAGE.msgs.length) ask(true);
  }
  function close() {
    if (__xjPushed && !__xjFromPop) { __xjPushed = false; try { history.back(); } catch (e) {} }
    if (RUN) { RUN.abort(); RUN = null; }
    var mask = $('xjMask');
    if (mask) mask.remove();
    var el = $('xjChat');
    if (el) { el.hidden = true; el.classList.remove('xj-on'); }
    resetViewport();
    document.body.style.overflow = '';
  }

  function card() {
    return '<div class="sys-pill"><span>盘面</span>**' + esc(digest()) + '**</div>';
  }
  function renderMsgs() {
    var host = $('xjMsgs');
    var near = host.scrollHeight - host.scrollTop - host.clientHeight < 80;
    var html = card();
    var lastTs = 0;
    PAGE.msgs.forEach(function (m, idx) {
      if (m.silent) return;
      var ts = m.ts || 0;
      if (ts && (idx === 0 || ts - lastTs > 5 * 60 * 1000)) {
        var d = new Date(ts);
        var hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2);
        html += '<div class="time">' + hh + ':' + mm + '</div>';
        lastTs = ts;
      }
      if (m.onboard) {
        html += '<div class="onboard"><div class="ob-badge">AI</div>'
          + '<div class="ob-t">还没有接入模型</div>'
          + '<div class="ob-s">配置一个 OpenAI 兼容接口后，就能按这张盘来解读。</div>'
          + '<button type="button" class="ob-b">去配置</button></div>';
        return;
      }
      var isMe = m.role === 'user';
      var body = m.image
        ? '<img src="' + m.image + '" alt="已选图片" style="display:block;max-width:180px;border-radius:10px">'
        : (isMe ? esc(m.text) : (typeof md2html === 'function' ? md2html(m.text) : esc(m.text)));
      if (m.pending && !m.text) body = '<span class="wait">正在解析<span class="dots"></span></span>';
      if (m.err && m.retry) body += '<button type="button" class="retry" data-retry="' + idx + '">重试</button>';
      html += '<div class="row ' + (isMe ? 'me' : 'ai') + '">'
        + (isMe ? '' : '<div class="ava" aria-hidden="true">解</div>')
        + '<div class="bub' + (m.err ? ' err' : '') + (m.pending ? ' pending' : '') + '">' + body + '</div>'
        + (isMe ? '<div class="ava me" aria-hidden="true">我</div>' : '')
        + '</div>';
    });
    if (cfg().photo && PHOTO) {
      html += '<div class="row me"><div class="bub"><img src="' + PHOTO + '" alt="待发送图片" style="display:block;max-width:180px;border-radius:10px"><button type="button" id="xjDrop" style="display:block;margin-top:8px;border:0;background:transparent;color:inherit;font-size:13px">删除这张</button></div><div class="ava me" aria-hidden="true">我</div></div>';
    }
    host.innerHTML = html;
    var drop = $('xjDrop');
    if (drop) drop.onclick = clearPhoto;
    var obBtn = host.querySelector('.ob-b');
    if (obBtn) obBtn.onclick = function () {
      if (typeof openAiConfig === 'function') { openAiConfig(); return; }
      try { window.parent.postMessage({type:'xiang-config'}, '*'); } catch (e) {}
    };
    var retries = host.querySelectorAll('.retry');
    for (var i = 0; i < retries.length; i++) {
      retries[i].onclick = function () {
        var m = PAGE.msgs[parseInt(this.getAttribute('data-retry'), 10)];
        if (m && m.retry) stream(m.retry.q, m.retry.image);
      };
    }
    if (near) host.scrollTop = host.scrollHeight;
    updateDown();
  }
  function updateDown() {
    var host = $('xjMsgs'), btn = $('xjDown');
    if (!host || !btn) return;
    var far = host.scrollHeight - host.scrollTop - host.clientHeight > 240;
    btn.hidden = !far;
  }

  function ask(silent) {
    var user = cfg().ask;
    PAGE.msgs.push({ role: 'user', text: user, silent: !!silent, ts: Date.now() });
    stream(user);
  }
  function onSend() {
    if (cfg().photo && PHOTO) { sendPhoto(); return; }
    var q = $('xjQ');
    var text = (q.value || '').trim();
    if (RUN) { tip('正在生成，点 ■ 可停止'); return; }
    if (!text) { tip('先写一句，或再选一张图'); return; }
    q.value = '';
    q.style.height = 'auto';
    PAGE.msgs.push({ role: 'user', text: text, ts: Date.now() });
    renderMsgs();
    stream(text);
  }
  function pickPhoto(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    var old = $('xjPick');
    if (old) old.remove();
    var f = $('xjAlbum');
    if (!f) { tip('选图还没挂上'); return; }
    f.value = '';
    try { f.click(); }
    catch (err) { tip('这台手机拦了选图'); }
  }
  function onPhoto(id) {
    var f = $(id || 'xjAlbum');
    var file = f && f.files && f.files[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) { tip('图片太大，请换一张'); return; }
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function () {
      var w = img.naturalWidth || img.width;
      var h = img.naturalHeight || img.height;
      var max = 800;
      var scale = Math.min(1, max / Math.max(w, h));
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      PHOTO = canvas.toDataURL('image/jpeg', 0.8);
      try { sessionStorage.setItem('xj-photo-' + pageName(), PHOTO); } catch (e) {}
      URL.revokeObjectURL(url);
      renderMsgs();
      /* 选完即解析：不让用户再点一次发送 */
      setTimeout(function () {
        if (!PHOTO) return;
        if (RUN) return;
        try { sendPhoto(); } catch (e) {}
      }, 80);
    };
    img.onerror = function () { URL.revokeObjectURL(url); tip('这张图读不了'); };
    img.src = url;
  }
  function clearPhoto() {
    PHOTO = '';
    try { sessionStorage.removeItem('xj-photo-' + pageName()); } catch (e) {}
    var a = $('xjAlbum'); if (a) a.value = '';
    var c = $('xjCamera'); if (c) c.value = '';
    renderMsgs();
  }
  function sendPhoto() {
    if (!PHOTO) { tip('请先上传图片'); return; }
    if (RUN) return;
    var q = $('xjQ');
    var note = q && q.value ? q.value.trim() : '';
    var shot = PHOTO;
    PAGE.msgs.push({ role: 'user', text: note || '请看这张图', image: shot });
    PAGE.unlocked = true;
    if (q) {
      q.value = '';
      q.disabled = false;
      q.placeholder = '接着问';
      q.style.height = 'auto';
    }
    renderMsgs();
    var prompt = PAGE.msgs.filter(function (m) { return m.image; }).length > 1
      ? (cfg().ask + '\n这张是后补的。可能是重拍、换一只手或换一张脸，也可能是局部补充。先看这张新图，再对照前面已经发过的图。看不清的不编。')
      : cfg().ask;
    stream(note ? (prompt + '\n用户补充：' + note) : prompt, shot);
    PHOTO = '';
    try { sessionStorage.removeItem('xj-photo-' + pageName()); } catch (e) {}
  }
  function historyFor(question, image) {
    var sys = SYS + '\n' + (window.__aiSysCustom || '') + schoolExtra() + '\n' + PLAIN;
    var msgs = [{ role: 'system', content: sys + '\n\n【盘面底稿】\n' + contextText() }];
    var recent = PAGE.msgs.filter(function (m) { return m.text && !m.pending && !m.err; }).slice(-8);
    recent.forEach(function (m) {
      if (m === recent[recent.length - 1] && m.role === 'user') return;
      if (m.image) {
        msgs.push({ role: 'user', content: [
          { type: 'text', text: m.text || '请看这张图' },
          { type: 'image_url', image_url: { url: m.image } }
        ] });
      } else {
        msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text });
      }
    });
    var content = image
      ? [{ type: 'text', text: question }, { type: 'image_url', image_url: { url: image } }]
      : question;
    msgs.push({ role: 'user', content: content });
    return msgs;
  }
  function stream(question, image) {
    var hold = { role: 'assistant', text: '', pending: true, ts: Date.now() };
    PAGE.msgs.push(hold);
    renderMsgs();
    ensureModels().then(function (list) {
      if (!list.length) {
        hold.pending = false;
        hold.onboard = true;
        hold.text = '';
        renderMsgs();
        return;
      }
      startStream(hold, list[0], question, image);
    });
  }

  function startStream(hold, m, question, image) {
    var paintTimer = null, paintPending = false;
    var __cfg = cfg() || {};
    var SEG = !!__cfg.segment;
    function paintStream() {
      paintTimer = null; paintPending = false;
      var host = $('xjMsgs'); if (!host) return;
      var rows = host.querySelectorAll('.row.ai');
      var row = rows[rows.length - 1]; if (!row) return;
      var bub = row.querySelector('.bub'); if (!bub) return;
      var near = host.scrollHeight - host.scrollTop - host.clientHeight < 80;
      bub.innerHTML = full
        ? (typeof md2html === 'function' ? md2html(full) : esc(full))
        : '<span class="wait">正在解析<span class="dots"></span></span>';
      if (near) host.scrollTop = host.scrollHeight;
    }
    function schedulePaint() {
      if (paintPending) return;
      paintPending = true;
      paintTimer = setTimeout(paintStream, 60);
    }
    var ctrl = new AbortController();
    RUN = ctrl;
    var timedOut = false;
    var killer = setTimeout(function () { timedOut = true; try { ctrl.abort(); } catch (e) {} }, 90000);
    var send = $('xjSend');
    if (send) { send.textContent = '■'; send.onclick = function () { ctrl.abort(); }; }
    var full = '';
    fetch(m.baseUrl.replace(/\/+$/, '') + '/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + m.apiKey },
      body: JSON.stringify({
        model: m.model, stream: true, temperature: 0.4,
        messages: historyFor(question, image)
      })
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status + ' ' + t.slice(0, 160)); });
      if (!r.body) throw new Error('无流式数据');
      var reader = r.body.getReader();
      var dec = new TextDecoder();
      var buf = '';
      function pump() {
        return reader.read().then(function (pack) {
          if (pack.done) return;
          buf += dec.decode(pack.value, { stream: true });
          var lines = buf.split('\n');
          buf = lines.pop();
          lines.forEach(function (ln) {
            var s = ln.trim();
            if (s.indexOf('data:') !== 0) return;
            var data = s.slice(5).trim();
            if (data === '[DONE]') return;
            try {
              var j = JSON.parse(data);
              var delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content || '';
              if (delta) {
                full += delta;
                if (SEG && /\n\s*\n/.test(full)) {
                  var segs = full.split(/\n\s*\n/);
                  var tail = segs.pop();
                  var at = PAGE.msgs.indexOf(hold);
                  if (at >= 0) segs.forEach(function (sg) { sg = sg.trim(); if (sg) PAGE.msgs.splice(at++, 0, { role: 'assistant', text: sg, ts: Date.now() }); });
                  full = tail; hold.text = tail;
                  renderMsgs(); schedulePaint();
                } else {
                  hold.text = full; schedulePaint();
                }
              }
            } catch (e) {}
          });
          return pump();
        });
      }
      return pump();
    }).then(function () {
      clearTimeout(killer);
      if (paintTimer) { clearTimeout(paintTimer); paintTimer = null; }
      paintPending = false;
      hold.pending = false;
      if (!hold.err) hold.retry = null;
      if (!hold.text) hold.text = '模型没有返回内容。';
    }).catch(function (e) {
      clearTimeout(killer);
      if (paintTimer) { clearTimeout(paintTimer); paintTimer = null; }
      paintPending = false;
      hold.pending = false;
      if (e.name === 'AbortError' && !timedOut) {
        if (!hold.text) hold.text = '已停止。';
      } else {
        var msg = timedOut ? '请求超时，请重试。'
          : ((typeof aiErrText === 'function') ? aiErrText(e) : (e.message || '请求失败'));
        hold.err = true;
        hold.retry = { q: question, image: image || '' };
        hold.text = hold.text && hold.text.trim()
          ? hold.text + '\n\n⚠ ' + msg
          : msg;
      }
    }).then(function () {
      RUN = null;
      if (send) { send.textContent = '↑'; send.onclick = onSend; }
      renderMsgs();
    });
  }

  function hideLegacy() {
    var host = $('aiMount');
    if (host) host.hidden = true;
    var blk = $('aiBlock');
    if (blk) { blk.hidden = true; blk.open = false; }
  }
  function tip(msg) {
    if (typeof showCopyTip === 'function') showCopyTip(msg);
  }
  function clickAct(act) {
    var found = document.querySelector('#aiMount button[data-xj="' + act + '"]');
    if (found) found.click();
    else tip('这项还没挂上');
  }
  function paintMenu(mask) {
    var models = [];
    try { models = (typeof aiModels === 'function') ? aiModels() : []; } catch (e) {}
    var on = models.filter(function (m) { return m && m.enabled !== false; }).length;
    function row(a, label, desc, cls) {
      return '<button type="button" class="menu-row' + (cls ? ' ' + cls : '') + '" data-a="' + a + '">'
        + '<span class="menu-t">' + label + '</span>'
        + (desc ? '<em class="menu-d">' + desc + '</em>' : '')
        + '<i class="menu-arrow">›</i></button>';
    }
    mask.innerHTML = ''
      + '<div id="xjMenu" class="menu-sheet" role="dialog" aria-label="更多功能">'
      + '<div class="grab"></div>'
      + '<div class="menu-grp">模型</div>'
      + row('model', '模型配置', '已启用 ' + on + ' / ' + models.length)
      + row('refresh', '刷新模型', '重新读取本地配置')
      + row('stop', '停止生成', RUN ? '正在生成' : '当前空闲')
      + '<div class="menu-grp">对话</div>'
      + row('export', '导出对话', '保存为文本')
      + row('clear', '清除本轮对话', '不可恢复', 'danger')
      + '<div class="menu-grp">排盘</div>'
      + row('copy', '复制排盘数据')
      + row('share', '复制分享链接')
      + row('print', '打印 / 存为 PDF')
      + '<button type="button" class="menu-cancel" data-cancel="1">取消</button>'
      + '</div>';
    mask.querySelector('#xjMenu').addEventListener('click', function (e) { e.stopPropagation(); });
    mask.querySelector('[data-cancel]').onclick = function () { mask.remove(); };
    mask.querySelectorAll('button[data-a]').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-a');
        mask.remove();
        runAct(a);
      };
    });
  }
  function openSheet() {
    var old = document.getElementById('xjMask');
    if (old) old.remove();
    var mask = document.createElement('div');
    mask.id = 'xjMask';
    mask.setAttribute('style', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;display:block;background:rgba(0,0,0,.35)');
    ($('xjChat') || document.body).appendChild(mask);
    paintMenu(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
  }
  function openConfig() {
    var old = document.getElementById('xjMask');
    if (old) old.remove();
    var mask = document.createElement('div');
    mask.id = 'xjMask';
    mask.className = 'cfg-mask';
    ($('xjChat') || document.body).appendChild(mask);
    var models = [];
    try { models = (typeof aiModels === 'function') ? aiModels() : []; } catch (e) {}
    var rows = models.map(function (m, i) {
      var on = m && m.enabled !== false;
      var nm = esc((m && (m.name || m.model)) || '未命名');
      var sub = esc((m && (m.provider || m.baseUrl)) || '');
      return '<div class="cfg-item">'
        + '<div class="cfg-item-main">**' + nm + '**<span>' + sub + '</span></div>'
        + '<button type="button" class="cfg-switch' + (on ? ' on' : '') + '" data-i="' + i + '" data-do="toggle" aria-label="' + (on ? '停用' : '启用') + '"><i></i></button>'
        + '<button type="button" class="cfg-del" data-i="' + i + '" data-do="del" aria-label="删除">删除</button>'
        + '</div>';
    }).join('');
    mask.innerHTML = ''
      + '<div class="cfg-page">'
      + '<div class="cfg-head"><button type="button" id="xjCfgBack" aria-label="返回">‹</button>**模型配置**<span></span></div>'
      + '<p class="cfg-note">填写 OpenAI 兼容接口。Key 只保存在这台手机里，不上传。</p>'
      + '<div class="cfg-card">'
      + '<label class="cfg-label" for="xjProv">服务商（选填）</label>'
      + '<input id="xjProv" class="cfg-input" placeholder="例如 火山方舟 / DeepSeek" autocomplete="off">'
      + '<label class="cfg-label" for="xjBase">接口地址</label>'
      + '<input id="xjBase" class="cfg-input" placeholder="https://…/v1" inputmode="url" autocomplete="off">'
      + '<label class="cfg-label" for="xjKey">API Key</label>'
      + '<input id="xjKey" class="cfg-input" type="password" placeholder="sk-…" autocomplete="off">'
      + '<label class="cfg-label" for="xjModel">模型名</label>'
      + '<input id="xjModel" class="cfg-input" placeholder="例如 deepseek-chat" autocomplete="off">'
      + '<div class="cfg-actions"><button type="button" id="xjSave">保存并使用</button><button type="button" id="xjTest">测试连接</button></div>'
      + '<div id="xjCfgMsg" class="cfg-msg"></div>'
      + '</div>'
      + '<div class="cfg-list-title">已保存<span>' + models.length + ' 个</span></div>'
      + '<div class="cfg-list">' + (rows || '<div class="cfg-empty">还没有模型</div>') + '</div>'
      + '</div>';
    document.getElementById('xjCfgBack').onclick = function () { mask.remove(); };
    document.getElementById('xjSave').onclick = function () { saveConfig(); };
    document.getElementById('xjTest').onclick = function () { testConfig(); };
    mask.querySelectorAll('button[data-do]').forEach(function (b) {
      b.onclick = function () { changeModel(Number(b.getAttribute('data-i')), b.getAttribute('data-do')); };
    });
  }
  function configDraft() {
    return {
      name: document.getElementById('xjModel').value.trim(),
      provider: document.getElementById('xjProv').value.trim(),
      baseUrl: document.getElementById('xjBase').value.trim().replace(/\/+$/, ''),
      apiKey: document.getElementById('xjKey').value.trim(),
      model: document.getElementById('xjModel').value.trim(),
      enabled: true
    };
  }
  function saveConfig() {
    var m = configDraft();
    var msg = document.getElementById('xjCfgMsg');
    if (!m.baseUrl || !m.apiKey || !m.model) { msg.textContent = '接口地址、Key、模型名都要填'; return; }
    if (typeof getAiCfg !== 'function' || typeof setAiCfg !== 'function') { msg.textContent = '配置模块没载上'; return; }
    var c = getAiCfg() || {};
    if (!c.models) c.models = [];
    c.models.push(m);
    setAiCfg(c);
    if (typeof broadcastAiConfig === 'function') broadcastAiConfig(c);
    openConfig();
  }
  function testConfig() {
    var m = configDraft();
    var msg = document.getElementById('xjCfgMsg');
    if (!m.baseUrl || !m.apiKey || !m.model) { msg.textContent = '接口地址、Key、模型名都要填'; return; }
    msg.textContent = '正在测试…';
    fetch(m.baseUrl + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + m.apiKey },
      body: JSON.stringify({ model: m.model, messages: [{ role: 'user', content: '回复两个字：正常' }], max_tokens: 16, stream: false })
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status + ' ' + t.slice(0, 80)); });
      return r.json();
    }).then(function (j) {
      var txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || '已连通';
      msg.textContent = '连接成功：' + String(txt).slice(0, 20);
    }).catch(function (e) {
      msg.textContent = '测试失败：' + (e.message || '网络被拦截');
    });
  }
  function changeModel(i, action) {
    if (typeof getAiCfg !== 'function' || typeof setAiCfg !== 'function') return;
    var c = getAiCfg() || {};
    if (!c.models || !c.models[i]) return;
    if (action === 'del') c.models.splice(i, 1);
    else c.models[i].enabled = c.models[i].enabled === false;
    setAiCfg(c);
    if (typeof broadcastAiConfig === 'function') broadcastAiConfig(c);
    openConfig();
  }
  function runAct(a) {
    if (a === 'parse') { ask(false); return; }
    if (a === 'model') { openConfig(); return; }
    if (a === 'refresh') { if (typeof refreshAiPanel === 'function') refreshAiPanel(true); tip('已刷新模型'); return; }
    if (a === 'stop') { if (RUN) { RUN.abort(); RUN = null; } if (typeof stopAiAnalyze === 'function') stopAiAnalyze(); tip('已停止'); return; }
    if (a === 'copy') { if (typeof copyAiData === 'function') copyAiData(); else copyText(contextText()); return; }
    if (a === 'print') { if (typeof printPage === 'function') printPage(); return; }
    if (a === 'share') { clickAct('link'); return; }
    if (a === 'jsonOut') { clickAct('dl'); return; }
    if (a === 'jsonCopy') { clickAct('copy'); return; }
    if (a === 'jsonIn') {
      var input = document.querySelector('#aiMount input[type=file]');
      if (input) input.click(); else tip('导入还没挂上');
      return;
    }
    if (a === 'export') { if (typeof exportAiChat === 'function') exportAiChat(); return; }
    if (a === 'again') { PAGE.msgs = []; ask(true); return; }
    if (a === 'clear') {
      if (!confirm('清除本轮对话？不可恢复。')) return;
      PAGE.msgs = [];
      if (typeof clearAiChat === 'function') {
        var ask = window.confirm;
        window.confirm = function () { return true; };
        try { clearAiChat(); } finally { window.confirm = ask; }
      }
      renderMsgs();
    }
  }
  function copyText(text) {
    var done = function () { if (typeof showCopyTip === 'function') showCopyTip('已复制'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () {});
    else done();
  }

  function showTools() { hideLegacy(); }
  function hideTools() { hideLegacy(); }

  function mountButton() {
    var c = cfg();
    if (!c) return;
    var host = $(c.host);
    var shown = false;
    if (host && ready()) {
      var vis = !host.hidden && host.getAttribute('hidden') == null;
      try { if (window.getComputedStyle(host).display === 'none') vis = false; } catch (e) {}
      if (host.id === 'result-shell') shown = document.body.classList.contains('shell-result') || vis;
      else if (host.id === 'sxShouOut' || host.id === 'mianOut') shown = true;
      else if (host.id === 'zgOut' || c.fill) shown = host.textContent.trim().length > 0;
      else shown = vis || host.textContent.trim().length > 20;
    }
    if (!shown) {
      var old = $('xjAiDock');
      if (old) old.remove();
      return;
    }
    if ($('xjAiDock') && $('xjAiDock').parentNode === host) return;
    var old2 = $('xjAiDock');
    if (old2) old2.remove();
    var dock = document.createElement('div');
    dock.id = 'xjAiDock';
    dock.innerHTML = '<style>'
      + '#xjAiDock{position:fixed;left:16px;right:16px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:80;margin:0;padding:0;background:transparent}'
      + 'html.embed #xjAiDock{display:block!important}'
      + '#xjAiDock button.xjAiBtn{display:block;box-sizing:border-box;width:100%;height:50px;margin:0;padding:0;border:0;border-radius:16px;background:#2F6F5B;color:#fff;font-size:17px;font-weight:650;line-height:50px;text-align:center;box-shadow:0 8px 22px rgba(28,40,48,.18)}'
      + 'html.ios-skin.ios-skin #xjAiDock button.xjAiBtn{display:block!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:none!important;height:50px!important;margin:0!important;padding:0!important;border:0!important;border-radius:16px!important;background:#2F6F5B!important;color:#fff!important;font-size:17px!important;font-weight:650!important;line-height:50px!important;text-align:center!important;flex:none!important}'
      + 'html.ios-skin.ios-skin #xjAiDock button.xjAiBtn:active{transform:scale(.98)!important}'
      + '</style><button type="button" class="xjAiBtn" id="xjAiBtn">AI 解析</button>';
    document.body.appendChild(dock);
    $('xjAiBtn').onclick = open;
    hideTools();
  }

  function watch() {
    hideLegacy();
    mountButton();
    if (READY) return;
    READY = true;
    var host = $(cfg().host);
    if (!host) return;
    if (host.id === 'sxShouOut' || host.id === 'mianOut') {
      window.__aiGetContext = function () {
        return (host.textContent || '').trim() || (pageName() === 'shouxiang' ? '手相页，尚未勾选自查。' : '面相页，尚未勾选自查。');
      };
    }
    if (!window.MutationObserver) return;
    var mo = new MutationObserver(function () { hideLegacy(); mountButton(); });
    mo.observe(host, { attributes: true, childList: true, attributeFilter: ['hidden', 'class'] });
  }

  function boot() {
    if (!cfg()) return;
    if (typeof mountAI !== 'function') return;
    watch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function () { setTimeout(boot, 0); });
  window.xjOpenChat = open;
  window.xjChatClose = close;
  window.__xjChatIsOpen = function () { var el = $('xjChat'); return !!(el && el.classList.contains('xj-on')); };
})();
