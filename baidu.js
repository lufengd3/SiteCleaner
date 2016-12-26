clean();

function clean() {
  var headerBg = document.querySelector('#s_top_wrap');
  var headerLeft = document.querySelector('#s_upfunc_menus');
  var headerRight = document.querySelector('#u_sp');
  var footer = document.querySelector('#bottom_container');
  var logo = document.querySelector('#lg');
  var searchBtn = document.querySelector('#s_fm input[type="submit"]');

  headerBg.remove();
  headerLeft.remove();
  headerRight.remove();
  footer.remove();
  logo.remove();
  searchBtn.setAttribute('value', 'Search');
}