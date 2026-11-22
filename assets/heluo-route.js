/* 进页只显示输入。排命卦成功后，从命卦起整页换成结果页。不排卦。 */
(function(){
  function formPage(){ return document.getElementById("hlFormPage"); }
  function resultPage(){ return document.getElementById("hlResultPage"); }
  function placeAi(on){
    var host=document.getElementById("aiMount");
    var block=document.getElementById("aiBlock");
    var slot=document.getElementById("hlResultAi");
    var form=formPage();
    if(on){
      if(block && slot && block.parentNode!==slot) slot.appendChild(block);
      if(slot) slot.hidden=true;
      if(block) block.open=false;
      return;
    }
    if(host && host.parentNode) host.parentNode.removeChild(host);
    if(block && block.parentNode) block.parentNode.removeChild(block);
  }
  function shellTop(){
    var nodes=[];
    try{
      if(window.frameElement) nodes.push(window.frameElement);
      if(window.parent && window.parent.document){
        var list=window.parent.document.querySelectorAll(".subpage,.xj-frame,.xj-view,#subpage-layer");
        for(var i=0;i<list.length;i++) nodes.push(list[i]);
      }
    }catch(e){}
    nodes.push(document.scrollingElement, document.documentElement, document.body);
    for(var j=0;j<nodes.length;j++){
      var n=nodes[j];
      if(!n) continue;
      try{ n.scrollTop=0; n.scrollLeft=0; }catch(e){}
    }
    try{ window.scrollTo(0,0); }catch(e){}
    try{ if(window.parent && window.parent!==window) window.parent.scrollTo(0,0); }catch(e){}
  }
  function paint(on){
    var form=formPage(), result=resultPage();
    if(!form || !result) return;
    form.hidden=!!on;
    result.hidden=!on;
    form.style.setProperty("display", on ? "none" : "block", "important");
    result.style.setProperty("display", on ? "block" : "none", "important");
    placeAi(!!on);
    document.body.classList.toggle("hl-result", !!on);
    shellTop();
    setTimeout(shellTop, 60);
    setTimeout(shellTop, 360);
  }
  window.hlShowResult=function(){ paint(true); };
  window.hlLeaveResult=function(){ paint(false); };
  function boot(){ paint(false); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
