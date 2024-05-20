Page({
  data: {
    list: [], // 客户提交订单
    popup_img: "", // 弹窗图片
    user: {
      show: false, // 用户详情显示
      data: null, // 用户数据
    },
  },
  onLoad() {
    this.app = getApp();
    this.channel = this.getOpenerEventChannel();
    this.channel.on("comfirm_list", (data) => {
      // for (let val of data) {
      //   val.start_text = this.format_time_text(val.start);
      //   val.end_text = this.format_time_text(val.end);
      //   val.room_text = this.format_room_text(val.room);
      //   val.pets = val.pet_name.join("、");
      // }
      let p = ["花花", "灰灰"];
      let list = [
        {
          customer_name: "xxx",
          pets: p.join("、"),
          start_text: this.format_time_text(1711670400000),
          end_text: this.format_time_text(1743120000000),
          room_text: this.format_room_text("2"),
          cost: 18000,
          customer_id: "ocEJ163A7xx4b8s5pol9qlvJXepc",
        },
      ];
      this.setData({
        // list: data,
        list: list,
      });
    });
  },
  // 关闭当前页时
  onUnload() {
    // 将修改后的订单传回主页面
    this.channel.emit("message", {
      type: "confirm",
      data: this.data.list,
    });
  },
  // 生成房间文字
  format_room_text(room_id) {
    switch (room_id) {
      case "3":
        return "豪华间1";
      case "11":
        return "豪华间2";
      default:
        if (room_id == "1" || room_id == "2") {
          return `标准间${room_id}`;
        } else if (Number(room_id) >= 4 && Number(room_id) <= 10) {
          return `标准间${Number(room_id) - 1}`;
        } else if (room_id == "12" || room_id == "13") {
          return `标准间${Number(room_id) - 2}`;
        } else if (room_id == "0") {
          // 还有无房间的 其他业务
          return "无";
        }
    }
  },
  // 时间文字
  format_time_text(time) {
    let t = new Date(time);
    return `${t.getFullYear()}.${t.getMonth() + 1}.${t.getDate()}`;
  },
  // 修改订单
  async edit_order(e) {
    let { type, index } = e.currentTarget.dataset;
    let list = this.data.list;
    // 修改订单状态
    wx.showToast({
      title: "",
      icon: "loading",
      mask: true,
    });
    let condition = { _id: list[index]._id };
    let params = {};
    switch (type) {
      case "confirm":
        condition.customer_id = list[index].customer_id;
        params.status = 1;
        break;
      case "cancel":
        params.status = -1;
        break;
    }
    let res = await this.app.mycall("orders", {
      type: "put",
      condition,
      params,
    });
    wx.hideToast();
    if (res.code !== 200) {
      return;
    }
    // 更新成功 从待确认列表中删除
    list.splice(index, 1);
    this.setData({ list });
  },
  // 关闭图片弹窗
  close_pop_img(e) {
    if (e.detail.type === "close") {
      this.setData({
        popup_img: "",
      });
    }
  },
  // 放大显示图片
  zoom_in() {
    this.setData({
      popup_img:
        "cloud://cloud1-0gzy726e39ba4d96.636c-cloud1-0gzy726e39ba4d96-1320186052/room.png",
    });
  },
  // 弹窗显示用户详情
  async check_user_detail(e) {
    let { user_id } = e.currentTarget.dataset;
    let { data: res } = await this.app.mycall("customer", {
      type: "get",
      condition: {
        user_id,
      },
    });
    console.log("sssssssss", res);
    this.setData({
      "user.show": true,
    });
  },
  // 关闭用户弹窗
  close_pop_user() {
    if (e.detail.type === "close") {
      this.setData({
        "user.show": false,
      });
    }
  },
});
