Page({
  data: {
    sets: [
      { title: "标间价格：", value: 0 },
      { title: "豪华间价格：", value: 0 },
    ],
    focus: -1, //高亮样式
  },
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
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
  // 失去高亮
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
  save() {
    wx.showToast({
      title: "保存成功",
    });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
  },
});
