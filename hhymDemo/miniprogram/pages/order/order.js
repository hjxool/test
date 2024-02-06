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
    edit: {
      select: "", //正在操作的订单id
      is_edit: false, // 是否正在编辑
      start_time: "", // 正在编辑的时间
      end_time: "",
      start_text: "", // 格式化的开始时间
      end_text: "",
      pet_name: "", //宠物名
      room: "", // 房间id
    },
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
    this.setData({
      [tag]: e.detail.value,
    });
    // 每次选完从第一页查
    this.data.page_num = 1;
    this.get_data();
  },
  // 选择器点取消清除值
  clear_value(e) {
    let { tag } = e.currentTarget.dataset;
    this.setData({
      [tag]: "",
    });
  },
  // 编辑订单值
  edit_order_value(e) {
    let { tag } = e.currentTarget.dataset;
    if (tag == "edit.start" || tag == "edit.end") {
      // 只有时间选择 需要特殊处理
      this.setData({
        [`${tag}_time`]: e.detail.value,
      });
      this.setData({
        [`${tag}_text`]: this.format_time_text(e.detail.value),
      });
    } else {
      // 其他的默认什么值 就保存什么值
      this.setData({
        [tag]: e.detail.value,
      });
    }
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
      // 翻页是将新的数据处理后 拼接在之前的数组后
      let l = res.data.map((e) => ({
        _id: e._id,
        start_text: this.format_time_text(e.start),
        end_text: this.format_time_text(e.end),
        cost: e.cost,
        room_text: this.format_room_text(e.room),
        room_id: e.room,
        pet_name: e.pet_name.join("、"),
      }));
      this.setData({
        list: this.data.list.concat(l),
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
  // 加载下一页
  load_next(e) {
    // 大于等于总页数时不执行
    if (this.data.page_num >= this.total_page) {
      return;
    }
    this.data.page_num++;
    this.get_data();
  },
  // 选中订单
  select_order(e) {
    if (this.data.edit.is_edit) {
      return
    }
    let { id } = e.currentTarget.dataset;
    // 选中同一个 折叠显示 选中不同的赋值
    if (id === this.data.edit.select) {
      this.setData({
        "edit.select": "",
      });
    } else {
      this.setData({
        "edit.select": id,
      });
    }
  },
  // 编辑、保存订单
  edit_order(e) {
    let { tag, index } = e.currentTarget.dataset;
    if (tag == "save") {
    } else if (tag == "edit") {
      // 编辑时将对应订单值处理后赋值给编辑表单
      let d = this.data.list[index];
      this.setData({
        "edit.is_edit": true,
        "edit.start_time": d.start_text.replace(/\./g, "-"),
        "edit.start_text": d.start_text,
        "edit.end_time": d.end_text.replace(/\./g, "-"),
        "edit.end_text": d.end_text,
        "edit.pet_name": d.pet_name,
        "edit.cost": d.cost,
        "edit.room": d.room_id,
      });
    }
  },
});
