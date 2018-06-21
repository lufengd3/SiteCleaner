var scriptName = getScriptName();

if (scriptName === 'svg.js') {
  loadScript('svg-lib.js');
  loadScript('jquery.js');
}

loadScript(scriptName);


function loadScript(scriptName) {
  if (!scriptName) return false;

  var s = document.createElement('script');
  s.src = chrome.extension.getURL(scriptName);
  (document.body).appendChild(s);
  s.onload = function() {
    s.parentNode.removeChild(s);
  };
}

function getScriptName() {
  if (location.hostname.indexOf('weibo.com') > -1) return 'weibo.js';

  if (location.hostname.indexOf('baidu.com') > -1) return 'baidu.js';

  if (location.hostname.indexOf('rme.labs.taobao.net') > -1) return 'svg.js';

  return '';
}