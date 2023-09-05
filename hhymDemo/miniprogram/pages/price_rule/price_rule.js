Page({
  data: {
    list: [], //规则列表
    pop_show: false, //显示弹窗
    pop_hide: true, //隐藏弹窗动画
  },
  async onLoad(options) {
    this.app = getApp();
    this.channel = this.getOpenerEventChannel();
    // 进入页面时查询规则列表
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let res = await this.app.mycall("rule_list");
    console.log(res);
    for (let val of res) {
      val.start_text = this.format_date_text(val.start);
      val.end_text = this.format_date_text(val.end);
      if (val.room.length === 13) {
        val.room_text = "全部";
      } else {
        val.room_text = this.format_room_text(val.room);
      }
    }
    this.setData({
      list: res,
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 700);
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "price_rule",
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
  async popup(event) {
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
      // 关闭弹窗后刷新列表
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
      let res = await this.app.mycall("rule_list");
      for (let val of res) {
        val.start_text = this.format_date_text(val.start);
        val.end_text = this.format_date_text(val.end);
        if (val.room.length === 13) {
          val.room_text = "全部";
        } else {
          val.room_text = this.format_room_text(val.room);
        }
      }
      this.setData({
        list: res,
      });
      setTimeout(() => {
        wx.hideLoading();
      }, 700);
    }
  },
});
