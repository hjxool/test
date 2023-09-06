Page({
  data: {
    sets: [
      { title: "标间价格：", value: 0 },
      { title: "豪华间价格：", value: 0 },
      { title: "包月天数：", value: 0 },
      { title: "包月折扣：", value: 0 },
      { title: "半月天数：", value: 0 },
      { title: "半月折扣：", value: 0 },
    ],
    focus: -1, //高亮样式
  },
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    this.app = getApp();
    this.get_data();
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "room_price",
    });
  },
  // 输入框高亮
  focus(e) {
    this.setData({
      focus: e.currentTarget.dataset.index,
    });
  },
  // 失去高亮时将页面元素的值保存到js
  blur(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      focus: -1,
      [`sets[${index}].value`]: e.detail.value,
    });
  },
  // 返回上一页
  page_back() {
    wx.navigateBack();
  },
  // 保存设置
  async save() {
    let body = {
      price1: Number(this.data.sets[0].value),
      price2: Number(this.data.sets[1].value),
      month_day: Number(this.data.sets[2].value),
      month_discount: Number(this.data.sets[3].value),
      half_month_day: Number(this.data.sets[4].value),
      half_month_discount: Number(this.data.sets[5].value),
      type: this.type,
    };
    if (this.type === "put") {
      body._id = this.id;
    }
    let res = await this.app.mycall("set_price", body);
    if (res) {
      wx.showToast({
        title: "保存成功",
      });
      setTimeout(() => {
        wx.hideToast();
      }, 1000);
    }
  },
  // 获取数据
  async get_data() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let res = await this.app.mycall("set_price");
    if (res && res.data) {
      // 如果有返回值则是更新 否则是新增
      this.type = "put";
      this.id = res.data._id; //记录id更新时用
      this.setData({
        "sets[0].value": res.data.price1,
        "sets[1].value": res.data.price2,
        "sets[2].value": res.data.month_day,
        "sets[3].value": res.data.month_discount,
        "sets[4].value": res.data.half_month_day,
        "sets[5].value": res.data.half_month_discount,
      });
    } else {
      this.type = "post";
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
  },
});
