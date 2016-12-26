var s = document.createElement('script');
var scriptName = getScriptName();

if (scriptName) {
  s.src = chrome.extension.getURL(scriptName);
  (document.body).appendChild(s);
  s.onload = function() {
    s.parentNode.removeChild(s);
  };
}

function getScriptName() {
  if (location.hostname.indexOf('weibo.com') > -1) return 'weibo.js';

  if (location.hostname.indexOf('baidu.com') > -1) return 'baidu.js';

  return '';
}