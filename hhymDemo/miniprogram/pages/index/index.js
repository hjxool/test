Page({
  data: {
    isManager: 2, // 0管理员 1普通用户 2加载时不显示
  },
  async onLoad(options) {
    this.app = getApp();
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
      this.isManager = type;
      this.setData({
        isManager: type,
        // isManager: 1,
      });
    } else {
      console.log("登陆失败");
    }
  },
  onShow() {
    // 管理员不用更新数据
    if (!this.isManager) {
      return;
    }
    // 页面第一次加载时不需要更新时间、房型组件数据
    if (this.first_load) {
      // 通知子组件更新数据
      let dom = this.selectComponent("#user");
      // 选择时间组件更新起止时间
      let st = this.app.globalData.start_time;
      let et = this.app.globalData.end_time;
      dom.selectComponent("#select_time").setData({
        start_date: new Date(st),
        end_date: new Date(et),
      });
      // 房型组件更新均价
      dom.selectComponent("#house_type").calculate_average_price();
    } else {
      this.first_load = true;
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
