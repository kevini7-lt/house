// 页面跳转统一封装，后续如果接入埋点或权限拦截，只需要改这里。
function navigateTo(url) {
  wx.navigateTo({ url });
}

function redirectTo(url) {
  wx.redirectTo({ url });
}

function goBack(delta = 1) {
  wx.navigateBack({ delta });
}

module.exports = {
  navigateTo,
  redirectTo,
  goBack
};
