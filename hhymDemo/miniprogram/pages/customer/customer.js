Page({
  data: {
    on_focus: false, //输入框获得焦点时样式
    list: [], //客户信息列表
  },
  onLoad() {
    this.app = getApp();
  },
  // 获取用户列表
  async get_data(e) {
    wx.showLoading({
      title: "",
      mask: true,
    });
    let { data: res } = await this.app.mycall("customer", {
      type: "get",
      condition: {
        name: e.detail.value,
      },
    });
    let list = []
    if (res) {
      for(let val of res){
        let t = []
        for(let val2 of val.pets){
          t.push(val2.name)
        }
        val.pet_name = t.join('、')
      }
      list = res
    }
    this.setData({
      list,
    });
    wx.hideLoading();
  },
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
    wx.showToast({ title: "已复制到剪贴板", icon: "none" });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
  },
});
