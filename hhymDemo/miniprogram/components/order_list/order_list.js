Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    orders: Array, //从父组件传入的订单原始数据
  },
  data: {
    order_list: [], //订单列表
  },
  lifetimes: {
    async attached() {
      this.app = getApp();
      // 初次加载时查询用户订单
      let { data: res } = await this.app.mycall("orders", { type: "get" });
      if (!res) {
        return;
      }
      this.setData({
        order_list: this.format_list(res),
      });
    },
  },
  methods: {
    // 将日期对象转换成文字
    format_time_text(date) {
      if (typeof date === "number") {
        date = new Date(date);
      }
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    },
    // 房间名拼接在一起
    format_room_text(id) {
      switch (id) {
        case "3":
          return "豪华间1";
        case "11":
          return "豪华间2";
        default:
          if (id == "1" || id == "2") {
            return `标准间${id}`;
          } else if (Number(id) >= 4 && Number(id) <= 10) {
            return `标准间${Number(id) - 1}`;
          } else if (id == "2" || id == "13") {
            return `标准间${Number(id) - 2}`;
          }
      }
    },
    // 将原始数据处理成显示数组
    format_list(source) {
      let list = [];
      for (let val of source) {
        let t = {
          start_text: this.format_time_text(val.start),
          end_text: this.format_time_text(val.end),
          days: Math.ceil((val.end - val.start) / (24 * 60 * 60 * 1000)),
          room: this.format_room_text(val.room),
          price: val.cost,
          status: val.status,
          _id: val._id,
        };
        list.push(t);
      }
      return list;
    },
  },
  observers: {
    // 当传入的订单数据变化时重新初始化显示的订单列表
    orders: function (newValue) {
      this.setData({
        order_list: this.format_list(newValue),
      });
    },
  },
});
