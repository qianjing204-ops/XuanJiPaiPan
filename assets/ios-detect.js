/* 平台标记：iOS 加 is-ios 类，供样式区分「原生控件」与「网页自绘」 */
(function(){
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var el = document.documentElement;
  el.classList.add(ios ? 'is-ios' : 'is-web');
})();
