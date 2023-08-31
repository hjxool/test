Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    orders: [], //订单列表
  },
  lifetimes: {
    attached() {
      let list = [];
      let t = {
        start_time: new Date("2023/7/11"),
        end_time: new Date("2023/7/20"),
        rooms: ["标间A", "标间B"],
        price: 152,
        status: 0, //0待确认 1已成交 -1已取消
        _id: "1",
      };
      t.start_text = this.format_time_text(t.start_time);
      t.end_text = this.format_time_text(t.end_time);
      t.days = Math.ceil(
        (t.end_time.getTime() - t.start_time.getTime()) / (24 * 60 * 60 * 1000)
      );
      t.room = this.format_room_text(t.rooms);
      list.push(t);
      let t2 = {
        start_time: new Date("2023/9/1"),
        end_time: new Date("2023/9/2"),
        rooms: ["豪华A"],
        price: 133,
        status: 1,
        _id: "2",
      };
      t2.start_text = this.format_time_text(t2.start_time);
      t2.end_text = this.format_time_text(t2.end_time);
      t2.days = Math.ceil(
        (t2.end_time.getTime() - t2.start_time.getTime()) /
          (24 * 60 * 60 * 1000)
      );
      t2.room = this.format_room_text(t2.rooms);
      list.push(t2);
      this.setData({
        orders: list,
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 将日期对象转换成文字
    format_time_text(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    },
    // 房间名拼接在一起
    format_room_text(list) {
      let t = "";
      for (let index = 0; index < list.length; index++) {
        if (index < list.length - 1) {
          t += `${list[index]}、`;
        } else {
          t += list[index];
        }
      }
      return t;
    },
  },
});
