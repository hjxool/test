Page({
  data: {
    form: {
      user: "", // 用户索引
      pet: "", // 宠物
      start: "", //开始时间
      end: "", //结束时间
      room: "0", // 房间索引
      cost: "", // 金额
    },
    user_list: [], //用户列表
    room_list: [
      "无",
      "标准间1",
      "标准间2",
      "豪华间1",
      "标准间3",
      "标准间4",
      "标准间5",
      "标准间6",
      "标准间7",
      "标准间8",
      "标准间9",
      "豪华间2",
      "标准间10",
      "标准间11",
    ], // 房间列表
    is_confirm: false, // 是否已经提交 提交后按钮显示为再来一单
  },
  async onLoad() {
    this.app = getApp();
    wx.showLoading({
      title: "",
      mask: true,
    });
    // 加载用户列表
    await this.get_users();
    wx.hideLoading();
  },
  // 查询用户列表
  async get_users() {
    let { data: res } = await this.app.mycall("customer", {
      type: "get",
      condition: {},
    });
    if (res) {
      this.setData({
        user_list: res,
      });
    }
  },
  // 编辑值
  select_value(e) {
    let { tag } = e.currentTarget.dataset;
    this.setData({
      [tag]: e.detail.value,
    });
  },
  // 提示
  tips(msg) {
    wx.showToast({
      title: msg,
      mask: true,
    });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
  },
  // 提交添加订单
  async submit() {
    let form = this.data.form;
    for (let key in form) {
      if (!form[key]) {
        this.tips("值不能为空");
        return;
      }
    }
    let st = new Date(form.start.replace(/\//g, "-")).getTime();
    let et = new Date(form.end.replace(/\//g, "-")).getTime();
    if (st >= et) {
      this.tips("开始时间不能大于等于结束时间");
      return;
    }
    let user = this.data.user_list[form.user];
    let data = {
      customer_id: user._id,
      customer_name: user.name,
      pet_name: form.pet.split("、"),
      start: form.start,
      end: form.end,
      room: form.room,
      cost: Number(form.cost),
      status: 1,
    };
    wx.showLoading({
      title: "提交中...",
      mask: true,
    });
    let res = await this.app.mycall("orders", {
      type: "post",
      params: data,
    });
    wx.hideLoading();
    if (res.code !== 200) {
      return;
    }
    this.setData({
      is_confirm: true,
    });
  },
  // 刷新数据
  refresh() {
    for (let key in this.data.form) {
      this.data.form[key] = "";
    }
    this.data.form.room = "0";
    this.setData({
      form: this.data.form,
      is_confirm: false,
    });
  },
});
