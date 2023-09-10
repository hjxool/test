Page({
  data: {
    // 因为房间布局分散 不是一个for循环遍历拆分成多个对象数组
    room1_3: [],
    room4_5: [],
    room6_8: [],
    room9_10: [],
    room11_13: [],
    pop_show: false, //显示弹窗
    pop_hide: true, //隐藏弹窗动画
  },
  onLoad(options) {
    this.app = getApp();
    // 根据用户选择时间段 查询这段时间内成交的订单 看房间有无空闲
    for (let index = 1; index <= 3; index++) {
      let t = {
        id: index,
        status: 0, //0空闲 1占用
        name: `标间${index}`,
      };
      if (index == 3) {
        t.name = "豪华间1";
      }
      this.data.room1_3.push(t);
    }
    for (let index = 4; index <= 5; index++) {
      let t = {
        id: index,
        status: 0,
        name: `标间${index - 1}`,
      };
      this.data.room4_5.push(t);
    }
    for (let index = 6; index <= 8; index++) {
      let t = {
        id: index,
        status: 0,
        name: `标间${index - 1}`,
      };
      this.data.room6_8.push(t);
    }
    for (let index = 9; index <= 10; index++) {
      let t = {
        id: index,
        status: 0,
        name: `标间${index - 1}`,
      };
      this.data.room9_10.push(t);
    }
    for (let index = 11; index <= 13; index++) {
      let t = {
        id: index,
        status: 0,
        name: `标间${index - 2}`,
      };
      if (index == 11) {
        t.name = "豪华间2";
      }
      this.data.room11_13.push(t);
    }
    this.data.room4_5[1].status = 1;
    this.data.room9_10[1].status = 1;
    this.setData({
      room1_3: this.data.room1_3,
      room4_5: this.data.room4_5,
      room6_8: this.data.room6_8,
      room9_10: this.data.room9_10,
      room11_13: this.data.room11_13,
    });
  },
  // 打开确认选房提示信息
  async select_room(e) {
    let room = e.currentTarget.dataset;
    // 状态占用不可选
    if (room.status) {
      return;
    }
    // app.globalData.pop_content = "confirm_room";
    // this.setData({
    //   pop_show: true,
    //   pop_hide: false,
    // });
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
      // 此处只会收到确认弹窗
    }
  },
});
