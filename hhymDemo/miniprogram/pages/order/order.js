Page({
  data: {
    list: [], //订单列表
    select_date: "", //时间筛选
    select_user: "", // 用户筛选 选的数组元素下标
    user_list: [], // 用户列表
    select_status: "", // 订单状态
    order_status: [
      { label: "已确认", value: 1 },
      { label: "待确认", value: 0 },
      { label: "已过期", value: 2 },
      { label: "已取消", value: -1 },
    ],
    page_num: 1, //查询页数
    page_size: 10, //查询条数
  },
  async onLoad(options) {
    this.app = getApp();
    // 查询用户列表
    await this.get_users();
    // 每次打开查询全部订单
    await this.get_data();
  },
  // 选择时间等
  select_value(e) {
    let { tag } = e.currentTarget.dataset;
    console.log(e.detail.value);
    this.setData({
      [tag]: e.detail.value,
    });
  },
  // 选择器点取消清除值
  clear_value(e) {
    let { tag } = e.currentTarget.dataset;
    this.setData({
      [tag]: "",
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
  async get_data() {
    let body = {
      condition: {},
      page_num: this.data.page_num,
      page_size: this.data.page_size,
    };
    if (this.data.select_date) {
      body.condition.start = this.data.select_date;
    }
    if (this.data.user_list[this.data.select_user]) {
      body.condition.customer_id = this.data.user_list[
        this.data.select_user
      ]._id;
    }
    if (this.data.order_status[this.data.select_status]) {
      body.condition.status = this.data.order_status[
        this.data.select_status
      ].value;
    }
    let { data: res } = await this.app.mycall("get_orders_by_paging", body);
    if (res) {
      // 记录总条数 避免翻页过了头
      this.total_page = Math.ceil(res.total / this.data.page_size);
      this.setData({
        list: res.data.map((e) => ({
          _id: e._id,
          start_text: this.format_time_text(e.start),
          end_text: this.format_time_text(e.end),
          cost: e.cost,
          room_text: this.format_room_text(e.room),
        })),
      });
    }
  },
  // 查询用户列表
  async get_users() {
    let { data: res } = await this.app.mycall("customer", {
      type: "get",
      condition: {},
    });
    if (res) {
      this.setData({
        user_list: res,
      });
    }
  },
});
