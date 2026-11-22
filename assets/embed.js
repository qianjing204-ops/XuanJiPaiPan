/* 嵌入外壳时换肤。江氏在嵌入态不注入 embed.css。测字已换肤，嵌入态同样加 embed。独立打开仍换肤。 */
document.addEventListener("touchstart", function(){}, {passive:true});
(function(){
  try{
    var q = location.search || "";
    var embedded = /(?:^|[?&])embed=1(?:&|$)/.test(q) || window.self !== window.top;
    if(!embedded) return;
    document.documentElement.classList.add("embed");
    if(typeof window.xjNowDate!=="function"){
      window.__xjAnchor = window.__xjAnchor || null;
      window.xjNowDate = function(){
        var m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(window.__xjAnchor || ""));
        if(m) return new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5]);
        return new Date();
      };
      window.xjNowStr = function(){
        var d = window.xjNowDate();
        function p2(n){ return (n<10?"0":"")+n; }
        return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())+" "+p2(d.getHours())+":"+p2(d.getMinutes());
      };
    }
    if(!document.getElementById("xj-result-jump")){
      var st=document.createElement("style");
      st.id="xj-result-jump";
      st.textContent="html.xj-on-result #input-area,html.xj-on-result #hlFormPage,html.xj-on-result #zwFormPage,html.xj-on-result .bazi-flow,html.xj-on-result #savedPanel,html.xj-on-result #formErr,html.xj-on-result #baziLinkage,html.xj-on-result .page>h1,html.xj-on-result .page>.lead,html.xj-on-result .page>.ios-module-title,html.xj-on-result .xj-result{display:none!important}html.xj-on-result #result-shell:not([hidden]),html.xj-on-result #baziResultPage:not([hidden]),html.xj-on-result #zwResultPage:not([hidden]),html.xj-on-result #hlResultPage:not([hidden]){display:block!important}html.embed body.shell-result #input-area,html.embed body.shell-result #hlFormPage,html.embed body.shell-result #zwFormPage,html.embed body.shell-result .page>h1,html.embed body.shell-result .page>.lead,html.embed body.shell-result .page>.ios-module-title,html.embed body.shell-result .xj-result{display:none!important}html.embed body.shell-result #result-shell,html.embed body.shell-result #hlResultPage,html.embed body.shell-result #zwResultPage{display:block!important}";
      document.documentElement.appendChild(st);
    }
    var css=document.createElement("link");
    css.rel="stylesheet";
    css.href="assets/embed.css?v=35";
    document.head.appendChild(css);
    function pressOf(node){
      var card = null;
      while(node && node !== document){
        if(node.classList){
          var dis = node.disabled || node.classList.contains("is-disabled") || node.getAttribute("aria-disabled")==="true";
          if(!dis && (node.classList.contains("btn") || node.tagName==="BUTTON" || (node.tagName==="A" && node.classList.contains("btn")))) return node;
          if(!card && (node.classList.contains("card") || node.classList.contains("info-box") || node.classList.contains("panel") || node.classList.contains("overview-card") || node.classList.contains("mod") || node.classList.contains("cal-cell"))) card = node;
        }
        node = node.parentNode;
      }
      return card;
    }
    function clearPress(){
      var nodes = document.querySelectorAll(".xj-press");
      for(var i=0;i<nodes.length;i++) nodes[i].classList.remove("xj-press");
    }
    document.addEventListener("touchstart", function(e){
      var t = pressOf(e.target);
      if(t) t.classList.add("xj-press");
    }, {passive:true});
    document.addEventListener("touchend", clearPress, {passive:true});
    document.addEventListener("touchcancel", clearPress, {passive:true});
    document.addEventListener("pointerup", clearPress, {passive:true});
    function markShell(){
      var shell = document.getElementById("result-shell");
      var bazi = document.getElementById("baziResultPage");
      var zw = document.getElementById("zwResultPage");
      var hl = document.getElementById("hlResultPage");
      var open = (shell && !shell.hidden) || (bazi && !bazi.hidden) || (zw && !zw.hidden) || (hl && !hl.hidden);
      document.documentElement.classList.toggle("xj-on-result", !!open);
      var forms=[document.getElementById("input-area"), document.getElementById("baziFormPage"), document.getElementById("zwFormPage"), document.getElementById("hlFormPage")];
      for(var fi=0; fi<forms.length; fi++){
        var form=forms[fi];
        if(!form) continue;
        if(open){
          form.hidden=true;
          form.style.setProperty("display","none","important");
        }else{
          form.hidden=false;
          form.style.removeProperty("display");
        }
      }
      if(shell && !shell.hidden) shell.style.setProperty("display","block","important");
      if(shell && shell.hidden) shell.style.removeProperty("display");
      if(shell && !shell.hidden && !shell.classList.contains("xj-in")) shell.classList.add("xj-in");
    }
    function watchResult(){
      var nodes=[document.body, document.getElementById("result-shell"), document.getElementById("baziResultPage"), document.getElementById("zwResultPage"), document.getElementById("hlResultPage")];
      if(window.MutationObserver){
        var ob=new MutationObserver(markShell);
        for(var i=0;i<nodes.length;i++){
          if(nodes[i]) ob.observe(nodes[i], {attributes:true, attributeFilter:["hidden","class"]});
        }
      }
      markShell();
    }
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", watchResult);
    else watchResult();
    function xjBackCleanup(){
      if(typeof markShell==="function") markShell();
      try{
        var sc=document.scrollingElement||document.documentElement;
        if(sc) sc.scrollTop=0;
        if(document.body) document.body.scrollTop=0;
        if(window.scrollTo) window.scrollTo(0,0);
      }catch(e){}
    }
    function shortFace(sel){
      if(sel.dataset.shortFace) return;
      sel.dataset.shortFace="1";
      var opts=sel.options;
      for(var i=0;i<opts.length;i++){
        var full=opts[i].text;
        var cut=full.indexOf("（");
        if(cut<0) cut=full.indexOf("(");
        if(cut>0){
          opts[i].dataset.full=full;
          opts[i].text=full.slice(0,cut);
        }
      }
      sel.addEventListener("focus", function(){
        var os=sel.options;
        for(var j=0;j<os.length;j++) if(os[j].dataset.full) os[j].text=os[j].dataset.full;
      });
      sel.addEventListener("blur", function(){
        var os=sel.options;
        for(var j=0;j<os.length;j++) if(os[j].dataset.full) os[j].text=os[j].dataset.full.slice(0, os[j].dataset.full.indexOf("（")>=0?os[j].dataset.full.indexOf("（"):os[j].dataset.full.indexOf("("));
      });
      sel.addEventListener("change", function(){ sel.blur(); });
    }
    function scan(){
      var nodes=document.querySelectorAll(".opts-row select");
      for(var i=0;i<nodes.length;i++) shortFace(nodes[i]);
    }
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", scan);
    else scan();
    var swipe = null;
    document.addEventListener("touchstart", function(e){
      var t = e.touches && e.touches[0];
      if(!t || t.clientX > 24){ swipe = null; return; }
      swipe = {x:t.clientX, y:t.clientY, t:Date.now()};
    }, {passive:true});
    document.addEventListener("touchend", function(e){
      if(!swipe) return;
      var t = e.changedTouches && e.changedTouches[0];
      var s = swipe;
      swipe = null;
      if(!t) return;
      var dx = t.clientX - s.x, dy = Math.abs(t.clientY - s.y);
      if(dx < 48 || dy > 60 || Date.now() - s.t >= 600) return;
      var shell = document.getElementById("result-shell");
      var bazi = document.getElementById("baziResultPage");
      var zw = document.getElementById("zwResultPage");
      var hl = document.getElementById("hlResultPage");
      var open = (shell && !shell.hidden) || (bazi && !bazi.hidden) || (zw && !zw.hidden) || (hl && !hl.hidden);
      if(open){
        if(shell && !shell.hidden && typeof window.shellAgain === "function") window.shellAgain();
        else if(bazi && !bazi.hidden && typeof window.baziLeaveResult === "function") window.baziLeaveResult();
        else if(zw && !zw.hidden && typeof window.zwLeaveResult === "function") window.zwLeaveResult();
        else if(hl && !hl.hidden && typeof window.hlLeaveResult === "function") window.hlLeaveResult();
        else if(typeof window.shellAgain === "function") window.shellAgain();
        else if(shell){ shell.hidden = true; document.body.classList.remove("shell-result"); }
        else if(bazi) bazi.hidden = true;
        else if(zw) zw.hidden = true;
        else if(hl) hl.hidden = true;
        xjBackCleanup();
        return;
      }
      try{ parent.postMessage({xj:"leave"}, "*"); }catch(err){}
    }, {passive:true});
    function xjTip(msg){
      var tip=document.getElementById("xjCastTip");
      if(!tip){
        tip=document.createElement("div");
        tip.id="xjCastTip";
        tip.setAttribute("style","margin:12px 16px;padding:12px 14px;border-radius:12px;background:#fff;color:#B84A3A;font-size:15px;line-height:1.45");
        var host=document.getElementById("input-area") || document.body;
        host.appendChild(tip);
      }
      tip.textContent=msg;
    }
    function xjCast(){
      var names=["qigua","doCast","paiju","query","paipan","go","hlCast","cast"];
      var hit=null;
      for(var i=0;i<names.length;i++){
        if(typeof window[names[i]]==="function"){ hit=names[i]; break; }
      }
      if(!hit){ xjTip("这一页没有找到排盘函数"); return; }
      try{ window[hit](); }
      catch(err){ xjTip(hit+" 出错："+(err && err.message ? err.message : "未知")); }
    }
    window.addEventListener("error", function(ev){
      if(!ev || !ev.message) return;
      xjTip(ev.message);
    });
    var xjCastMap={
      "qigua":"qigua","doCast":"doCast","paiju":"paiju","qzPai":"qzPai",
      "nmGo":"nmGo","query":"query","hlBtn":"renderQigua",
      "paipan":"paipan","xzPai":"xzPai"
    };
    function xjFillDate(id){
      var el=document.getElementById(id);
      if(!el || el.value) return;
      var d=new Date();
      function p2(n){ return (n<10?"0":"")+n; }
      el.value=d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate());
    }
    function xjForceResult(){
      var shell=document.getElementById("result-shell");
      var hl=document.getElementById("hlResultPage");
      var zw=document.getElementById("zwResultPage");
      var out=document.getElementById("out") || document.getElementById("hlQgOut");
      var has=out && String(out.textContent||"").replace(/\s/g,"").length>0;
      if(shell && has){
        shell.hidden=false;
        document.body.classList.add("shell-result");
      }
      if(hl && has){
        hl.hidden=false;
        var form=document.getElementById("hlFormPage");
        if(form) form.hidden=true;
      }
      if(typeof markShell==="function") markShell();
    }
    document.addEventListener("click", function(ev){
      var n=ev.target;
      var btn=null;
      while(n && n!==document){
        if(n.tagName==="BUTTON"){ btn=n; break; }
        n=n.parentNode;
      }
      if(!btn || btn.classList.contains("shell-again") || btn.classList.contains("hl-back")) return;
      var id=btn.id||"";
      var oc=btn.getAttribute("onclick")||"";
      var fn=xjCastMap[id];
      if(!fn){
        var m=/^\s*([A-Za-z_$][\w$]*)\s*\(/.exec(oc);
        if(m && xjCastMap[m[1]]) fn=m[1];
      }
      if(!fn) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      if(typeof window[fn]!=="function"){ xjTip("排盘函数还没载上："+fn); return; }
      ["dInput","qDate","qzDate","lyDate","hlDate","mDate","zDate","zTime","xzDate","xzTime"].forEach(xjFillDate);
      try{ window[fn](); }
      catch(err){ xjTip((err && err.message) ? err.message : String(err)); return; }
      setTimeout(xjForceResult, 40);
    }, true);
    window.addEventListener("message", function(ev){
      if(!ev.data || ev.data.xj !== "back") return;
      var shell = document.getElementById("result-shell");
      var bazi = document.getElementById("baziResultPage");
      var zw = document.getElementById("zwResultPage");
      var hl = document.getElementById("hlResultPage");
      var open = (shell && !shell.hidden) || (bazi && !bazi.hidden) || (zw && !zw.hidden) || (hl && !hl.hidden);
      if(!open) return;
      if(shell && !shell.hidden && typeof window.shellAgain === "function") window.shellAgain();
      else if(bazi && !bazi.hidden && typeof window.baziLeaveResult === "function") window.baziLeaveResult();
      else if(zw && !zw.hidden && typeof window.zwLeaveResult === "function") window.zwLeaveResult();
      else if(hl && !hl.hidden && typeof window.hlLeaveResult === "function") window.hlLeaveResult();
      else if(typeof window.shellAgain === "function") window.shellAgain();
      else if(shell){ shell.hidden = true; document.body.classList.remove("shell-result"); }
      else if(bazi) bazi.hidden = true;
      else if(zw) zw.hidden = true;
      else if(hl) hl.hidden = true;
      xjBackCleanup();
    });
  }catch(e){}
})();
