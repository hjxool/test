Page({
  data: {
    // 客户提交订单
    list: [],
  },
  onLoad() {
    this.app = getApp();
    this.channel = this.getOpenerEventChannel();
    this.channel.on("comfirm_list", (data) => {
      for (let val of data) {
        val.start_text = this.format_time_text(val.start);
        val.end_text = this.format_time_text(val.end);
        val.room_text = this.format_room_text(val.room);
      }
      this.setData({
        list: data,
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
        } else if (room_id == "2" || room_id == "13") {
          return `标准间${Number(room_id) - 2}`;
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
    let params = {}
    switch (type) {
      case "confirm":
        condition.customer_id = list[index].customer_id;
        params.status = 1
        break;
      case 'cancel':
        params.status = -1
        break
    }
    let res = await this.app.mycall("orders", {
      type: "put",
      condition,
      params,
    });
    wx.hideToast()
    if (res.code !== 200) {
      return;
    }
    // 更新成功 从待确认列表中删除
    list.splice(index, 1);
    this.setData({ list });
  },
});
