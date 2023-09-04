Page({
  data: {
    // 客户提交订单
    list: [],
  },
  onLoad() {
    this.channel = this.getOpenerEventChannel();
    this.channel.on("comfirm_list", (data) => {
      for (let val of data) {
        val.start = this.format_date_text(val.start_time);
        val.end = this.format_date_text(val.end_time);
        val.room_text = this.format_room_text(val.room);
      }
      this.setData({
        list: data,
      });
    });
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "confirm",
      res: this.data.list.length,
    });
  },
  // 根据日期对象生成日期文字
  format_date_text(time) {
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${y}.${m}.${d}`;
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
  // 确认订单
  confirm(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    list.splice(index, 1);
    this.setData({ list });
  },
  // 取消订单
  cancel(e) {
    let index = e.currentTarget.dataset.index;
  },
});
