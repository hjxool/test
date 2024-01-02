Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    modules: [
      { title: "客户列表", icon: "icon-kehu", page: "customer" },
      { title: "订单列表", icon: "icon-quanbudingdan", page: "order" },
      { title: "计价规则", icon: "icon-guize", page: "price_rule" },
      { title: "单价设置", icon: "icon-tixianguize", page: "room_price" },
      { title: "收入统计", icon: "icon-shuzhuangtu", page: "income_count" },
      {
        title: "上传图片",
        icon: "icon-mn_shangchuantupian_fill",
        page: "upload_photo",
      },
    ],
    confirm_num: 0, //待确认订单数
  },
  lifetimes: {
    // 组件实例进入节点树时执行
    async attached() {
      this.app = getApp();
      // 查询订单
      let { data: res } = await this.app.mycall("orders", {
        type: "get",
        params: {
          status: 0, //查询待确认订单
        },
      });
      this.order_list = res || [];
      this.setData({
        confirm_num: this.order_list.length, //订单数量
      });
    },
  },
  methods: {
    // 跳转对应页面
    turn_to_page(e) {
      let page = e.currentTarget.dataset.page;
      let from_child = (data) => {
        // 解析从子页面传递的数据
      };
      // 跳转不同页面触发不同事件
      let send_to_child;
      switch (page) {
        case "confirm":
          send_to_child = (res) => {
            res.eventChannel.emit("comfirm_list", this.order_list);
          };
          break;
        case "calendar":
        case "customer":
          send_to_child = (res) => {
            let list = [];
            for (let index = 0; index < 3; index++) {
              let t = {
                name: "xxx1",
                phone: "13356569874",
                weChat: "yyuujj",
                pet_name: "asdad",
                pet_detail: "asdasdasd2222",
                orders: [1, 2, 3, 4],
                pay: "750",
              };
              list.push(t);
            }
            res.eventChannel.emit("customer_list", list);
          };
          break;
        case "order":
          send_to_child = (res) => {
            let list = [];
            for (let index = 0; index < 3; index++) {
              let t = {
                start: new Date("2023/7/1"),
                end: new Date("2023/8/1"),
                name: "张三",
                price: 750,
                room: ["A01", "A02"],
              };
              list.push(t);
            }
            res.eventChannel.emit("order_list", list);
          };
          break;
        case "income_count":
          send_to_child = (res) => {
            res.eventChannel.emit("order_list", "");
          };
          break;
        default:
          send_to_child = (res) => {};
          break;
      }
      wx.navigateTo({
        url: `/pages/${page}/${page}`,
        events: {
          message: from_child,
        },
        success: send_to_child,
      });
    },
    // 刷新页面数据
    get_data() {
      console.log("refresh");
    },
  },
});
