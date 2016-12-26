clean();

function clean() {
  var topTip = document.querySelector('.gn_topmenulist_tips');
  var hotTip = document.querySelector('div[node-type="recommendTopic"]');
  var rightBar = document.querySelector('.WB_main_r');
  var leftBar = document.querySelector('.WB_main_l');
  var footer = document.querySelector('#plc_bot');

  topTip.remove();
  hotTip.remove();
  rightBar.remove();
  leftBar.remove();
  footer.remove();

  setBodyStyle();

  setTimeout(function() {
    var musicBox = document.querySelector('div[i-am-music-player]');
    console.log(musicBox);
    musicBox.remove();
  }, 1000);
}

function setBodyStyle() {
  var container = document.querySelector('#plc_main');
  var mainBody = document.querySelector('.WB_main_c');

  mainBody.style.display = 'block';
  mainBody.style.margin = '0 auto';
  container.style.width = 'auto';
  container.style.display = 'block';
}
