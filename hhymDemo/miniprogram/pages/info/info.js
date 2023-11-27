Page({
  data: {
    form: {
      name: "", //联系人
      phone: "", //手机号
      weChat: "", //微信号
      pet: [], //住店宠物
      start: "", //日期
      end: "", //日期
      room: "", //房间
      know_form: "", //从何知道好好养猫家
      total_day: "", //共几天
      is_read: false, //是否阅读了用户协议
    },
    room_type: 0, //房间类型 豪华间最多四个 普通间最多2个
  },
  onLoad(options) {
    this.app = getApp();
    // 读取时间
    let start = new Date(this.app.globalData.start_time);
    let end = new Date(this.app.globalData.end_time);
    // 读取房间id 判断是豪华还是标间
    let room_type;
    let room_name;
    switch (this.app.globalData.room) {
      case "3":
        room_type = 1;
        room_name = "豪华间1";
        break;
      case "11":
        room_type = 1;
        room_name = "豪华间2";
        break;
      default:
        room_type = 0;
        if (
          this.app.globalData.room == "1" ||
          this.app.globalData.room == "2"
        ) {
          room_name = `标准间${this.app.globalData.room}`;
        } else if (
          Number(this.app.globalData.room) >= 4 &&
          Number(this.app.globalData.room) <= 10
        ) {
          room_name = `标准间${Number(this.app.globalData.room) - 1}`;
        } else if (
          this.app.globalData.room == "2" ||
          this.app.globalData.room == "13"
        ) {
          room_name = `标准间${Number(this.app.globalData.room) - 2}`;
        }
        break;
    }
    // 读取当前客户信息看是否有记录 有则读取他的宠物信息自动填入计算价格 没有则显示默认价格
    // 提交订单时根据当前用户的openid修改原先的联系人等信息 有记录时读取这些信息
    this.setData({
      // "form.pet": [{ name: "嘟嘟", short: "嘟" }],
      "form.pet": [],
      "form.start": `${start.getFullYear()}.${
        start.getMonth() + 1
      }.${start.getDate()}`,
      "form.end": `${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()}`,
      "form.total_day": Math.ceil(
        (this.app.globalData.end_time - this.app.globalData.start_time) /
          (24 * 60 * 60 * 1000)
      ),
      room_type,
      "form.room": room_name,
    });
  },
  // 勾选阅读协议
  is_read() {
    this.setData({
      "form.is_read": !this.data.form.is_read,
    });
  },
  // 跳转协议、和宠物详情页
  turn_to_page(e) {
    let page = e.currentTarget.dataset.page;
    let body = {
      url: `/pages/${page}/${page}`,
    };
    switch (page) {
      case "pet":
        // 监听宠物页确认编辑传回的数据
        body.events = {
          pet_data(data) {
            console.log("表单:", data);
          },
        };
        // 如果是编辑而不是新增则传入数据
        let index = e.currentTarget.dataset.index;
        if (index >= 0) {
          // 有索引值说明点击的是编辑
          body.success = (res) => {
            res.eventChannel.emit("pet_data", this.data.form.pet[index]);
          };
        }
        break;
    }
    wx.navigateTo(body);
  },
  // 失去焦点保存值
  save_value(e) {
    let key = e.currentTarget.dataset.item;
    this.setData({
      [`form.${key}`]: e.detail.value,
    });
  },
  // 从宠物列表中移除
  del_pet(e) {
    let index = e.currentTarget.dataset.index;
    this.data.form.pet.splice(index, 1);
    this.setData({
      "form.pet": this.data.form.pet,
    });
  },
});
