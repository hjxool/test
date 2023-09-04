Page({
  data: {
    on_focus: false, //输入框获得焦点时样式
    list: [], //客户信息列表
  },
  onLoad() {
    this.channel = this.getOpenerEventChannel();
    this.channel.on("customer_list", (data) => {
      this.setData({
        list: data,
      });
    });
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "customer",
    });
  },
  // 搜索
  search() {},
  // 输入框获得焦点
  focus() {
    this.setData({
      on_focus: true,
    });
  },
  // 输入框失去焦点
  blur() {
    this.setData({
      on_focus: false,
    });
  },
  // 复制一行内容到剪贴板
  async copy_content(e) {
    let data = e.currentTarget.dataset.content;
    await wx.setClipboardData({ data });
    await wx.showToast({ title: "已复制到剪贴板",icon:'none' });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
  },
});
