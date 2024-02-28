Page({
  data: {
    on_focus: false, //输入框获得焦点时样式
    list: [], //客户信息列表
    edit: {
      select: "", //正在操作的订单id
      is_edit: false, // 是否正在编辑
      name: "", // 用户名
      phone: "", // 电话
      weChat: "", // 微信
      orders: "", // 订单数
      pay: "", // 金额
    },
    pop_show: false, // 显示弹窗
    pet_list: [], // 客户宠物信息列表
  },
  onLoad() {
    this.app = getApp();
    this.get_data();
  },
  // 获取用户列表
  async get_data(e) {
    wx.showLoading({
      title: "",
      mask: true,
    });
    let condition = {};
    if (e) {
      condition.name = e.detail.value;
    }
    let { data: res } = await this.app.mycall("customer", {
      type: "get",
      condition,
    });
    let list = [];
    if (res) {
      list = res;
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
    // 在编辑时不能触发复制
    if (this.data.edit.is_edit) {
      return;
    }
    let data = e.currentTarget.dataset.content;
    await wx.setClipboardData({ data });
    wx.showToast({ title: "已复制到剪贴板", icon: "none" });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
  },
  // 选中用户
  select_customer(e) {
    // 正在编辑订单不能选中其他订单
    if (this.data.edit.is_edit) {
      return;
    }
    let { id } = e.currentTarget.dataset;
    // 选中同一个 折叠显示 选中不同的赋值
    if (id === this.data.edit.select) {
      this.setData({
        "edit.select": "",
      });
    } else {
      this.setData({
        "edit.select": id,
      });
    }
  },
  // 编辑、保存用户信息
  async edit_customer(e) {
    let { tag, index } = e.currentTarget.dataset;
    let d = this.data.list[index];
    if (tag == "save") {
      let form = this.data.edit;
      // 金额 订单数 必须是数字
      if (isNaN(Number(form.orders))) {
        this.tips("订单必须是数字");
        return;
      }
      if (isNaN(Number(form.pay))) {
        this.tips("金额必须是数字");
        return;
      }
      // 先发送请求保存修改 当请求失败时不更新到页面 请求成功更新到页面但不刷新列表
      // 这样可以使列表停留在当前编辑的位置
      let res = await this.app.mycall("customer", {
        type: "put",
        condition: {
          _id: d._id,
        },
        params: {
          name: form.name,
          phone: form.phone,
          weChat: form.weChat,
          orders: Number(form.orders),
          pay: Number(form.pay),
        },
      });
      if (res.code !== 200) {
        this.tips("保存失败");
        return;
      }
      // 修改列表对映项 前缀
      let item = `list[${index}].`;
      this.setData({
        "edit.is_edit": false,
        "edit.select": "",
        [`${item}name`]: form.name,
        [`${item}phone`]: form.phone,
        [`${item}weChat`]: form.weChat,
        [`${item}orders`]: form.orders,
        [`${item}pay`]: form.pay,
      });
      this.tips("保存成功");
    } else if (tag == "edit") {
      // 编辑时将对应值处理后赋值给编辑表单
      this.setData({
        "edit.is_edit": true,
        "edit.name": d.name, // 传入输入框内容
        "edit.phone": d.phone,
        "edit.weChat": d.weChat,
        "edit.orders": d.orders,
        "edit.pay": d.pay,
      });
    } else if (tag === "del") {
      let res = await this.app.mycall("customer", {
        type: "del",
        condition: {
          _id: [d._id],
        },
      });
      if (res.code !== 200) {
        this.tips("删除失败");
        return;
      }
      // 不刷新列表在展示列表中删除
      this.data.list.splice(index, 1);
      this.setData({
        list: this.data.list,
      });
      this.tips("删除成功");
    }
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
  // 取消编辑
  cancel_edit() {
    this.setData({
      "edit.is_edit": false,
      "edit.select": "",
    });
  },
  // 编辑订单值
  edit_value(e) {
    let { tag } = e.currentTarget.dataset;
    this.setData({
      [tag]: e.detail.value,
    });
  },
  // 查看当天的订单信息
  async check(e) {
    if (this.data.edit.is_edit) {
      // 在编辑状态不能点击
      return
    }
    let { pets } = e.currentTarget.dataset;
    this.setData({
      pop_show: true,
      pet_list: pets,
    });
  },
});
