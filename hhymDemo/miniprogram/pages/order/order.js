Page({
  data: {
    list: [], //订单列表
    select_date: "", //时间筛选
  },
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    this.channel.on("order_list", (data) => {
      console.log(data)
      for (let val of data) {
        val.start_text = `${val.start.getFullYear()}.${
          val.start.getMonth() + 1
        }.${val.start.getDate()}`;
        val.end_text = `${val.end.getFullYear()}.${
          val.end.getMonth() + 1
        }.${val.end.getDate()}`;
        val.room_text = this.format_room_text(val.room)
      }
      this.setData({
        list: data,
      });
    });
  },
  onUnload() {
    this.channel.emit("message", { msg: "order_list" });
  },
  select_time(e) {
    this.setData({
      select_date: e.detail.value,
    });
  },
  // 生成房间文字
  format_room_text(list) {
    let t = "";
    let index = 0;
    for (let val of list) {
      if (index === list.length - 1) {
        t += `${val}`;
      } else {
        t += `${val}、`;
        index++;
      }
    }
    return t;
  },
});
