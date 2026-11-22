/* engine.js v1.0 —— 盘面渲染引擎（第 0 批基建）
   只渲染，不算盘。模块算法不动，迁到哪一页再由那一页调用 XJEngine.render。
   colorKey 只认 red / red2 / green / theme / null：
     red   → #b84a3a   凶/忌
     red2  → #9e3d2f   次凶
     green → #2e7d32   吉/用神（不是主题绿）
     theme → #34C759   主题强调
     null  → #1C1C1E   普通文本
   协议缺口（本版显式拒绝，不猜测）：
     - grid 空位：cells 未给出的格子留空，不补中宫说明；
     - grid 跨格：不支持 colspan / rowspan，出现即报错；
     - disk 宫位顺序：按 items 数组顺序，从正上方顺时针，不在引擎里重排黄道；
     - disk 的 spokes 只画 from→to 的弦，不解释相位含义。
*/
(function (global) {
  "use strict";

  var COLORS = {
    red: "#b84a3a",
    red2: "#9e3d2f",
    green: "#2e7d32",
    theme: "#34C759",
    null: "#1C1C1E"
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function colorOf(key) {
    if (key == null || key === "null" || key === "") return COLORS.null;
    if (!Object.prototype.hasOwnProperty.call(COLORS, key)) {
      throw new Error("engine: colorKey 只允许 red/red2/green/theme/null，收到 " + key);
    }
    return COLORS[key];
  }

  function clsOf(key) {
    if (key == null || key === "null" || key === "") return "";
    return " c-" + key;
  }

  function renderGrid(desc) {
    var g = desc.grid || {};
    var rows = g.rows | 0;
    var cols = g.cols | 0;
    if (rows < 1 || cols < 1) throw new Error("engine: grid 需要 rows 与 cols");
    var cells = desc.cells || [];
    var map = {};
    var i;
    for (i = 0; i < cells.length; i++) {
      var c = cells[i];
      if (c.colspan || c.rowspan) throw new Error("engine: 本版不支持跨格，请在模块侧拆格");
      map[c.row + "," + c.col] = c;
    }
    var html = '<div class="xj-board xj-grid ios-glass" style="display:grid;grid-template-columns:repeat(' +
      cols + ',minmax(0,1fr));gap:0">';
    var r, k;
    for (r = 0; r < rows; r++) {
      for (k = 0; k < cols; k++) {
        var cell = map[r + "," + k];
        if (!cell) {
          html += '<div class="xj-cell" data-empty="1"></div>';
          continue;
        }
        html += '<div class="xj-cell' + clsOf(cell.colorKey) + (cell.highlight ? " hl" : "") +
          '" style="color:' + colorOf(cell.colorKey) + '">' +
          '<span class="label">' + esc(cell.label) + '</span>' +
          (cell.sub ? '<span class="sub">' + esc(cell.sub) + '</span>' : "") +
          '</div>';
      }
    }
    return html + '</div>';
  }

  function renderList(desc) {
    var sections = desc.sections && desc.sections.length ? desc.sections : (desc.items ? [{ title: "", items: desc.items }] : []);
    var html = '<style>.xj-board .xj-py{margin-left:6px;color:#8E8E93;font-size:12px;font-weight:400}.xj-board .xj-parts{display:flex;flex-wrap:wrap;gap:4px}.xj-board .xj-part{border-radius:6px;background:#f2f2f7;padding:2px 6px;font-size:14px;color:#1C1C1E}.xj-board .xj-meta{display:block;color:#8E8E93;font-size:12px}.xj-board .xj-row{align-items:flex-start;flex-wrap:wrap}.xj-board .xj-hero{display:block;width:100%;font-size:48px;line-height:1.1;text-align:center;color:#1C1C1E;font-weight:600}</style><div class="xj-board xj-list ios-glass">';
    var i, j;
    for (i = 0; i < sections.length; i++) {
      var sec = sections[i];
      html += '<section class="xj-card">' + (sec.title ? '<h3 class="xj-sec">' + esc(sec.title) + '</h3>' : '');
      var items = sec.items || [];
      for (j = 0; j < items.length; j++) {
        var it = items[j];
        var parts = Array.isArray(it.components) ? it.components : [];
        var chips = "";
        var k;
        for (k = 0; k < parts.length; k++) {
          chips += '<span class="xj-part">' + esc(parts[k]) + '</span>';
        }
        var meta = "";
        if (it.radical || it.strokes) {
          meta = '<span class="xj-meta">' + esc(it.radical || "") +
            (it.radical && it.strokes ? "·" : "") +
            (it.strokes ? esc(it.strokes) + "画" : "") + '</span>';
        }
        var labelCls = it.hero ? "xj-hero" : "label";
        html += '<div class="xj-row xj-item' + clsOf(it.colorKey) + '" style="color:' + colorOf(it.colorKey) + '">' +
          '<span class="' + labelCls + '">' + esc(it.label) +
          (it.pinyin ? '<span class="xj-py">' + esc(it.pinyin) + '</span>' : "") +
          '</span>' +
          (chips ? '<span class="xj-parts">' + chips + '</span>' : "") +
          meta +
          (it.desc ? '<span class="desc">' + esc(it.desc) + '</span>' : "") +
          '</div>';
      }
      html += '</section>';
    }
    return html + '</div>';
  }

  /* 圆盘方向（第 1 批补全）：
       disk.direction = "ccw" 逆时针（占星：正上方白羊 0°，宫号向左走）
       disk.direction = "cw"  顺时针（七政：正上方起命宫）
       缺省仍是 cw，兼容第 0 批静态样例。
     落位：item.angle 为 0–360，0 在正上方，方向与 disk.direction 一致。
       有 angle 的项按角度落点，不占等分扇区。
       无 angle 的项按数组顺序等分，items[0] 的扇区中点在正上方。
     不重排黄道，不解释相位。spokes 仍只画 from→to 的弦。 */
  function diskAng(direction, turns) {
    var sign = direction === "ccw" ? -1 : 1;
    return -Math.PI / 2 + sign * turns * Math.PI * 2;
  }

  function renderDisk(desc) {
    var disk = desc.disk || {};
    var rings = desc.rings || [];
    var radii = disk.radius || [];
    var size = ((radii[0] || 120) + 16) * 2;
    var cx = size / 2;
    var cy = size / 2;
    var svg = '<svg class="xj-disk" viewBox="0 0 ' + size + ' ' + size +
      '" width="' + size + '" height="' + size + '">';
    var i, j;
    for (i = 0; i < rings.length; i++) {
      var ring = rings[i];
      var n = ring.segments | 0;
      if (n < 1) throw new Error("engine: disk ring 需要 segments");
      var outer = radii[i] != null ? radii[i] : (radii[ring.layer] || 80);
      var inner = radii[i + 1] != null ? radii[i + 1] : Math.round(outer * 0.62);
      var items = ring.items || [];
      var dir = disk.direction === "ccw" ? "ccw" : "cw";
      for (j = 0; j < n; j++) {
        var a0 = diskAng(dir, j / n);
        var a1 = diskAng(dir, (j + 1) / n);
        var sweep = dir === "ccw" ? 0 : 1;
        var large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
        var p = function (rad, ang) {
          return [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
        };
        var o0 = p(outer, a0), o1 = p(outer, a1), i1 = p(inner, a1), i0 = p(inner, a0);
        var d = 'M' + o0[0].toFixed(1) + ',' + o0[1].toFixed(1) +
          ' A' + outer + ',' + outer + ' 0 ' + large + ' ' + sweep + ' ' + o1[0].toFixed(1) + ',' + o1[1].toFixed(1) +
          ' L' + i1[0].toFixed(1) + ',' + i1[1].toFixed(1) +
          ' A' + inner + ',' + inner + ' 0 ' + large + ' ' + (1 - sweep) + ' ' + i0[0].toFixed(1) + ',' + i0[1].toFixed(1) + ' Z';
        var item = items[j] || {};
        svg += '<path d="' + d + '" fill="#FFFFFF" stroke="rgba(60,60,67,.1)"></path>';
        if (item.label && item.angle == null) {
          var mid = diskAng(dir, (j + 0.5) / n);
          var tr = (outer + inner) / 2;
          var tp = p(tr, mid);
          svg += '<text x="' + tp[0].toFixed(1) + '" y="' + tp[1].toFixed(1) +
            '" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="' +
            colorOf(item.colorKey) + '">' + esc(item.label) +
            (item.sub ? '<tspan x="' + tp[0].toFixed(1) + '" dy="12" font-size="9">' + esc(item.sub) + '</tspan>' : '') +
            '</text>';
        }
      }
      for (j = 0; j < items.length; j++) {
        var placed = items[j];
        if (placed.angle == null || placed.label == null) continue;
        var ang = diskAng(dir, Number(placed.angle) / 360);
        var rr = (outer + inner) / 2;
        var pp = p(rr, ang);
        svg += '<text x="' + pp[0].toFixed(1) + '" y="' + pp[1].toFixed(1) +
          '" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="' +
          colorOf(placed.colorKey) + '">' + esc(placed.label) + '</text>';
      }
    }
    var spokes = desc.spokes || [];
    for (i = 0; i < spokes.length; i++) {
      var sp = spokes[i];
      var n0 = (rings[0] && rings[0].segments) || 12;
      var r0 = radii[0] || 120;
      var spokeDir = disk.direction === "ccw" ? "ccw" : "cw";
      var ang = function (idx) { return diskAng(spokeDir, idx / n0); };
      var s0 = [cx + r0 * Math.cos(ang(sp.from)), cy + r0 * Math.sin(ang(sp.from))];
      var s1 = [cx + r0 * Math.cos(ang(sp.to)), cy + r0 * Math.sin(ang(sp.to))];
      svg += '<line x1="' + s0[0].toFixed(1) + '" y1="' + s0[1].toFixed(1) +
        '" x2="' + s1[0].toFixed(1) + '" y2="' + s1[1].toFixed(1) +
        '" stroke="#2F6F4F" stroke-width="1"></line>';
    }
    return '<div class="xj-board xj-disk-wrap ios-glass">' + svg + '</svg></div>';
  }



  function renderGua(desc) {
    var guas = desc.guas || [];
    if (!guas.length) return '<div class="xj-guas"><span style="color:#b84a3a">无卦象数据</span></div>';
    var posLabels = ["上爻", "五爻", "四爻", "三爻", "二爻", "初爻"];
    var html = '<style>html.ios-skin .xj-guas,html.embed .xj-guas{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;gap:16px;align-items:stretch;width:100%;max-width:100%;overflow-x:visible;box-sizing:border-box}</style>' +
      '<div class="xj-guas ios-glass" style="display:flex;flex-direction:column;gap:16px;align-items:stretch;width:100%;max-width:100%;overflow:visible;box-sizing:border-box;padding:12px 0">';
    var g, i, line, color, qinColor;
    for (g = 0; g < guas.length; g++) {
      if (!guas[g].lines || guas[g].lines.length !== 6) {
        throw new Error("卦象[" + g + "]爻数不为6，拒绝渲染");
      }
      html += '<div class="xj-gua" style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:100%;box-sizing:border-box;background:#fff;border-radius:8px;padding:12px 16px;box-shadow:0 2px 8px rgba(0,0,0,.06)">';
      html += '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;color:#333">' + esc(guas[g].name || ("卦" + (g + 1))) + '</div>';
      html += '<div style="display:flex;flex-direction:column;gap:4px">';
      for (i = 0; i < 6; i++) {
        line = guas[g].lines[i] || {};
        color = line.moving ? "#b84a3a" : "#333";
        html += '<div style="display:flex;align-items:center;gap:8px;height:22px">';
        html += '<span style="font-size:10px;color:#999;width:28px;text-align:right;flex-shrink:0">' + posLabels[i] + '</span>';
        if (line.yang) {
          html += '<span style="display:flex;width:60px;justify-content:center"><i style="display:block;width:60px;height:0;border-top:2px solid ' + color + '"></i></span>';
        } else {
          html += '<span style="display:flex;width:60px;justify-content:space-between"><i style="display:block;width:26px;height:0;border-top:2px solid ' + color + '"></i><i style="display:block;width:26px;height:0;border-top:2px solid ' + color + '"></i></span>';
        }
        html += '<span style="width:14px;font-size:12px;color:#b84a3a;font-weight:bold">' + (line.moving ? (line.yang ? "○" : "×") : "") + '</span>';
        if (line.qin) {
          qinColor = line.colorKey === "red" ? "#b84a3a" : line.colorKey === "green" ? "#2e7d32" : line.colorKey === "theme" ? "#34C759" : "#333";
          html += '<span style="font-size:11px;color:' + qinColor + ';margin-left:2px;white-space:nowrap">' + esc(line.qin) + '</span>';
        }
        if (line.god) html += '<span style="font-size:10px;color:#999;margin-left:4px;white-space:nowrap">' + esc(line.god) + '</span>';
        if (line.shi) html += '<span style="font-size:10px;background:#f2f2f7;border-radius:4px;padding:1px 4px;margin-left:4px;color:#333">世</span>';
        if (line.ying) html += '<span style="font-size:10px;background:#f2f2f7;border-radius:4px;padding:1px 4px;margin-left:4px;color:#333">应</span>';
        html += '</div>';
      }
      html += '</div></div>';
    }
    return html + '</div>';
  }



  var HUA_BG = { "禄": "#2e7d32", "权": "#34C759", "科": "#333", "忌": "#b84a3a" };

  function ziweiStar(s) {
    var size = s.minor ? "11px" : "15px";
    var weight = s.minor ? "400" : "600";
    var color = s.colorKey === "red" ? "#b84a3a" : s.colorKey === "red2" ? "#9e3d2f" : s.colorKey === "green" ? "#2e7d32" : s.colorKey === "theme" ? "#34C759" : "#1C1C1E";
    var html = '<span class="zw-star" style="font-size:' + size + ';font-weight:' + weight + ';color:' + color + ';line-height:1.4">' + esc(s.name || "");
    if (s.status) html += '<i style="font-style:normal;font-size:10px;color:#8e8e93;font-weight:400;margin-left:1px">' + esc(s.status) + '</i>';
    if (s.hua && HUA_BG[s.hua]) html += '<em style="font-style:normal;margin-left:3px;border-radius:3px;padding:1px 3px;font-size:10px;color:#fff;background:' + HUA_BG[s.hua] + '">' + esc(s.hua) + '</em>';
    return html + '</span>';
  }

  function renderZiwei(desc) {
    var pals = desc.palaces || [];
    if (pals.length !== 12) throw new Error("engine: 紫微必须正好 12 宫，收到 " + pals.length);
    var c = desc.center || {};
    var foot = desc.footer || {};
    var center = '<div class="zw-plate-center" style="margin:0 0 12px;padding:10px 12px;background:#fff;border-radius:8px;font-size:13px;color:#1C1C1E;line-height:1.6">' +
      '<div style="font-weight:600">' + esc(c.gender || "") + (c.wu_xing_ju ? "　五行局 " + esc(c.wu_xing_ju) : "") + '</div>' +
      (c.bazi ? '<div>八字 ' + esc(c.bazi) + '</div>' : "") +
      (c.solar ? '<div>阳历 ' + esc(c.solar) + '</div>' : "") +
      '</div>';
    var cards = "";
    var i, p, stars, j;
    for (i = 0; i < pals.length; i++) {
      p = pals[i];
      stars = p.stars || [];
      var body = "";
      for (j = 0; j < stars.length; j++) body += ziweiStar(stars[j]);
      if (!stars.length) body = '<span style="font-size:12px;color:#8e8e93">空宫</span>';
      cards += '<div class="zw-cell' + (p.is_ming ? " is-ming" : "") + '" style="box-sizing:border-box;min-height:92px;padding:8px;border:1px solid ' +
        (p.is_ming ? "#9e3d2f" : "rgba(60,60,67,.12)") + ';border-radius:8px;background:' + (p.is_ming ? "#f5e6f5" : "#fff") +
        ';display:flex;flex-direction:column;justify-content:space-between;gap:6px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px 8px;align-items:baseline">' + body + '</div>' +
        '<div style="display:flex;justify-content:space-between;gap:6px;font-size:12px;color:#1C1C1E"><b>' + esc(p.name || "") + '</b><span style="color:#8e8e93">' + esc(p.ganzhi || "") + '</span></div>' +
        '</div>';
    }
    var footer = foot.desc ? '<div class="zw-plate-foot" style="margin-top:12px;font-size:12px;color:#8e8e93">' +
      (foot.title ? '<b style="color:#1C1C1E;font-weight:600">' + esc(foot.title) + '</b>　' : "") + esc(foot.desc) + '</div>' : "";
    return '<style>' +
      'html.ios-skin .zw-plate,html.embed .zw-plate{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px;width:100%;box-sizing:border-box}' +
      '@media(max-width:640px){html.ios-skin .zw-plate,html.embed .zw-plate{grid-template-columns:repeat(2,minmax(0,1fr))!important}}' +
      '</style>' +
      '<div class="zw-plate-wrap ios-glass" style="width:100%;max-width:100%;overflow:visible;box-sizing:border-box">' +
      center + '<div class="zw-plate">' + cards + '</div>' + footer + '</div>';
  }

  function render(desc, mount) {
    if (!desc || !desc.type) throw new Error("engine: 缺少 type");
    var html;
    if (desc.type === "grid") html = renderGrid(desc);
    else if (desc.type === "list") html = renderList(desc);
    else if (desc.type === "disk") html = renderDisk(desc);
    else if (desc.type === "gua") html = renderGua(desc);
    else if (desc.type === "ziwei-plate") html = renderZiwei(desc);
    else throw new Error("engine: type 只允许 grid/disk/list/gua/ziwei-plate，收到 " + desc.type);
    if (mount) {
      var el = typeof mount === "string" ? document.querySelector(mount) : mount;
      if (!el) throw new Error("engine: 找不到挂载点");
      el.innerHTML = html;
    }
    return html;
  }

  var api = { render: render, COLORS: COLORS, version: "1.5" };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.XJEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
