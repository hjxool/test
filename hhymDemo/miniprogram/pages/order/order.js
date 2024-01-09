Page({
  data: {
    list: [], //订单列表
    select_date: "", //时间筛选
  },
  async onLoad(options) {
    this.app = getApp()
    // 每次打开查询全部订单
    await this.get_data()
  },
  select_time(e) {
    this.setData({
      select_date: e.detail.value,
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
  // 获取订单列表
  async get_data(){
    this.app.mycall('get_orders_by_paging',{
      
    })
  }
});
