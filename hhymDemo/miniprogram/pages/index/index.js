Page({
  data: {
    isManager: 2, // 0管理员 1普通用户 2加载时不显示
  },
  async onLoad(options) {
    wx.showLoading({
      title: "",
    });
    let { code } = await wx.login().then((res) => res);
    wx.hideLoading();
    if (code) {
      console.log("登陆成功");
      let {
        result: { type, id },
      } = await wx.cloud.callFunction({
        name: "isManager",
      });
      console.log(id)
      this.setData({
        isManager: type,
        // isManager: 1
      });
    } else {
      console.log("登陆失败");
    }
  },
});
