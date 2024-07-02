Page({
  data: {
    list: [], //订单列表
    select_date: "", //时间筛选
    select_user: "", // 用户筛选 选的数组元素下标
    user_list: [], // 用户列表
    select_status: "", // 订单状态
    order_status: [{
        label: "已确认",
        value: 1
      },
      {
        label: "待确认",
        value: 0
      },
      {
        label: "已过期",
        value: 2
      },
      {
        label: "已取消",
        value: -1
      },
    ],
    // 房间名及对应id
    rooms: [{
        label: "无",
        value: "0"
      },
      {
        label: "标准间1",
        value: "1"
      },
      {
        label: "标准间2",
        value: "2"
      },
      {
        label: "豪华间1",
        value: "3"
      },
      {
        label: "标准间3",
        value: "4"
      },
      {
        label: "标准间4",
        value: "5"
      },
      {
        label: "标准间5",
        value: "6"
      },
      {
        label: "标准间6",
        value: "7"
      },
      {
        label: "标准间7",
        value: "8"
      },
      {
        label: "标准间8",
        value: "9"
      },
      {
        label: "标准间9",
        value: "10"
      },
      {
        label: "豪华间2",
        value: "11"
      },
      {
        label: "标准间10",
        value: "12"
      },
      {
        label: "标准间11",
        value: "13"
      },
    ],
    page_num: 1, //查询页数
    page_size: 10, //查询条数
    edit: {
      select: "", //正在操作的订单id
      is_edit: false, // 是否正在编辑
      start_time: "", // 选择器中回显值
      end_time: "",
      start_text: "", // 页面显示文本
      end_text: "",
      pet_name: "", //宠物名
      cost: "", // 金额
      room_index: "", // 房间列表索引
      status_index: "", // 订单状态索引
    },
    popup_img: "", // 弹窗图片
    user: {
      show: false, // 用户详情显示
      data: null, // 用户数据
    },
  },
  async onLoad(options) {
    this.app = getApp();
    wx.showLoading({
      title: "",
      mask: true,
    });
    // 查询用户列表
    await this.get_users();
    // 每次打开查询全部订单
    await this.get_data();
    wx.hideLoading();
  },
  // 选择时间等
  async select_value(e) {
    let {
      tag
    } = e.currentTarget.dataset;
    this.setData({
      [tag]: e.detail.value,
      // 每次选完清空列表 而不是在现有列表后拼接
      list: [],
      // 每次选完从第一页查
      page_num: 1,
    });
    wx.showLoading({
      title: "",
      mask: true,
    });
    await this.get_data();
    wx.hideLoading();
  },
  // 选择器点取消清除值
  async clear_value(e) {
    let {
      tag
    } = e.currentTarget.dataset;
    this.setData({
      [tag]: "",
      // 每次选完清空列表 而不是在现有列表后拼接
      list: [],
      // 每次选完从第一页查
      page_num: 1,
    });
    wx.showLoading({
      title: "",
      mask: true,
    });
    await this.get_data();
    wx.hideLoading();
  },
  // 编辑订单值
  edit_order_value(e) {
    let {
      tag
    } = e.currentTarget.dataset;
    if (tag == "edit.start" || tag == "edit.end") {
      // 时间用的是选择器 所以要区分是保存回显值还是显示文本
      this.setData({
        [`${tag}_time`]: e.detail.value,
      });
      this.setData({
        [`${tag}_text`]: this.format_time_text(e.detail.value),
      });
    } else {
      // 其他的默认什么值 就保存什么值
      // 宠物文本不做处理 等提交保存时再拆分数组
      // 房间和订单状态 等提交保存时再根据索引取值
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
        } else if (room_id == "12" || room_id == "13") {
          return `标准间${Number(room_id) - 2}`;
        } else if (room_id == "0") {
          // 还有无房间的 其他业务
          return "无";
        }
    }
  },
  // 时间文字
  format_time_text(time) {
    let t = new Date(time);
    return `${t.getFullYear()}.${t.getMonth() + 1}.${t.getDate()}`;
  },
  // 订单状态文字
  format_status_text(status) {
    for (let val of this.data.order_status) {
      if (val.value === status) {
        return val.label;
      }
    }
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
    let {
      data: res
    } = await this.app.mycall("get_orders_by_paging", body);
    if (res) {
      // 记录总条数 避免翻页过了头
      this.total_page = Math.ceil(res.total / this.data.page_size);
      // 翻页是将新的数据处理后 拼接在之前的数组后
      let l = res.data.map((e) => ({
        _id: e._id,
        customer_id: e.customer_id, // 删除、或更新订单需要传用户id用来更新用户总支出
        customer_name: e.customer_name,
        start_text: this.format_time_text(e.start),
        end_text: this.format_time_text(e.end),
        cost: e.cost,
        room_text: this.format_room_text(e.room), // 房间名和id都是唯一值 用显示在页面的名称即可
        pet_name: e.pet_name.join("、"),
        status_text: this.format_status_text(e.status),
      }));
      this.setData({
        list: this.data.list.concat(l),
        // 重置正在操作订单
        "edit.select": "",
        "edit.is_edit": false,
      });
    }
  },
  // 查询用户列表
  async get_users() {
    let {
      data: res
    } = await this.app.mycall("customer", {
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
    // 正在编辑订单不能选中其他订单
    if (this.data.edit.is_edit) {
      return;
    }
    let {
      id
    } = e.currentTarget.dataset;
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
  async edit_order(e) {
    let {
      tag,
      index
    } = e.currentTarget.dataset;
    let d = this.data.list[index];
    if (tag == "save") {
      let form = this.data.edit;
      // 校验 开始时间不能大于等于结束时间
      let st = new Date(form.start_time).getTime();
      let et = new Date(form.end_time).getTime();
      if (st >= et) {
        this.tips("开始时间不能大于结束时间");
        return;
      }
      // 金额必须是数字
      if (isNaN(Number(form.cost))) {
        this.tips("金额必须是数字");
        return;
      }
      // 先发送请求保存修改 当请求失败时不更新到页面 请求成功更新到页面但不刷新列表
      // 这样可以使列表停留在当前编辑的位置
      let res = await this.app.mycall("orders", {
        type: "put",
        condition: {
          _id: d._id,
          customer_id: d.customer_id, // 涉及到订单改变用户支出也改变
        },
        params: {
          start: form.start_time,
          end: form.end_time,
          pet_name: form.pet_name.split("、"),
          cost: Number(form.cost),
          room: this.data.rooms[form.room_index].value,
          status: this.data.order_status[form.status_index].value,
        },
      });
      if (res.code !== 200) {
        this.tips("保存失败");
        return;
      }
      // 修改列表对映项 前缀
      let item = `list[${index}].`;
      this.setData({
        "edit.is_edit": false,
        "edit.select": "",
        [`${item}start_text`]: form.start_text,
        [`${item}end_text`]: form.end_text,
        [`${item}pet_name`]: form.pet_name,
        [`${item}cost`]: form.cost,
        [`${item}room_text`]: this.data.rooms[form.room_index].label,
        [`${item}status_text`]: this.data.order_status[form.status_index].label,
      });
      this.tips("保存成功");
    } else if (tag == "edit") {
      // 编辑时将对应订单值处理后赋值给编辑表单
      // 此处是根据房间名回显rooms列表索引
      let room_index;
      for (let i = 0; i < this.data.rooms.length; i++) {
        if (this.data.rooms[i].label === d.room_text) {
          room_index = i;
          break;
        }
      }
      let status_index;
      for (let i = 0; i < this.data.order_status.length; i++) {
        if (this.data.order_status[i].label === d.status_text) {
          status_index = i;
          break;
        }
      }
      this.setData({
        "edit.is_edit": true,
        "edit.start_time": d.start_text.replace(/\./g, "-"), //原值
        "edit.start_text": d.start_text, // 显示内容
        "edit.end_time": d.end_text.replace(/\./g, "-"),
        "edit.end_text": d.end_text,
        "edit.pet_name": d.pet_name, // 传入输入框内容
        "edit.cost": d.cost,
        "edit.room_index": room_index,
        "edit.status_index": status_index,
      });
    } else if (tag === "del") {
      let res = await this.app.mycall("orders", {
        type: "del",
        condition: {
          _id: [d._id],
          customer_id: d.customer_id,
        },
      });
      if (res.code !== 200) {
        this.tips("删除失败");
        return;
      }
      // 不刷新列表在展示列表中删除
      this.data.list.splice(index, 1);
      this.setData({
        list: this.data.list,
      });
      this.tips("删除成功");
    }
  },
  // 提示
  tips(msg) {
    wx.showToast({
      title: msg,
      mask: true,
    });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
  },
  // 取消编辑
  cancel_edit() {
    this.setData({
      "edit.is_edit": false,
      "edit.select": "",
    });
  },
  // 弹窗组件事件
  close_pop_img(e) {
    if (e.detail.type === "close") {
      this.setData({
        popup_img: "",
      });
    }
  },
  // 放大显示图片
  zoom_in() {
    this.setData({
      popup_img: "cloud://cloud1-0gzy726e39ba4d96.636c-cloud1-0gzy726e39ba4d96-1320186052/room.png",
    });
  },
  // 弹窗显示用户详情
  async check_user_detail(e) {
    let {
      user_id
    } = e.currentTarget.dataset;
    let {
      data: res
    } = await this.app.mycall("customer", {
      type: "get",
      condition: {
        user_id,
      },
    });
    if (res) {
      this.setData({
        "user.show": true,
        'user.data': res[0]
      });
    } else {
      this.tips('查询失败')
    }
  },
  // 关闭用户弹窗
  close_pop_user(e) {
    if (e.detail.type === "close") {
      this.setData({
        "user.show": false,
      });
    }
  },
});