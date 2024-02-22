Page({
  data: {
    isManager: 2, // 0管理员 1普通用户 2加载时不显示
  },
  async onLoad(options) {
    // 根页面加载显示弹窗 等所有子组件回复加载完成再隐藏弹窗
    wx.showLoading({
      title: "",
      mask: true,
    });
    let { code } = await wx.login().then((res) => res);
    if (code) {
      console.log("登陆成功");
      let {
        result: { type, id },
      } = await wx.cloud.callFunction({
        name: "isManager",
      });
      this.setData({
        isManager: type,
        // isManager: 1,
      });
    } else {
      console.log("登陆失败");
    }
  },
  // 接收子组件渲染完毕消息
  page_ready(e) {
    if (e.detail) {
      setTimeout(() => {
        wx.hideLoading();
      }, 300);
    }
  },
});
