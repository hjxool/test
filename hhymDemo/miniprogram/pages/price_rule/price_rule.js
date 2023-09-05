Page({
  data: {
    list: [], //规则列表
    pop_show: false, //显示弹窗
    pop_hide: true, //隐藏弹窗动画
  },
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    // 进入页面时查询规则列表
    let list = [];
    for (let index = 0; index < 3; index++) {
      let t = {
        start: new Date("2023/10/1"),
        end: new Date("2023/10/7"),
        price: 100,
        room: ["A01", "A02"],
      };
      t.start_text = this.format_date_text(t.start);
      t.end_text = this.format_date_text(t.end);
      if (t.room.length === 13) {
        t.room_text = "全部";
      } else {
        t.room_text = this.format_room_text(t.room);
      }
      list.push(t);
    }
    this.setData({ list });
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "price_rule",
    });
  },
  // 根据日期对象生成日期文字
  format_date_text(date) {
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
  // 打开弹窗
  add_rule() {
    let app = getApp();
    app.globalData.pop_content = "add_rule";
    this.setData({
      pop_show: true,
      pop_hide: false,
    });
  },
  // 显示|隐藏弹窗
  popup(event) {
    if (event.detail.type === "close pop") {
      this.setData({
        pop_hide: true,
      });
      // 放完动画再销毁
      setTimeout(() => {
        this.setData({
          pop_show: false,
        });
      }, 300);
    }
  },
});
