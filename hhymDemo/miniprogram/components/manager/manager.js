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
    calendar_num: 0, // 已确认未过时间的订单数
    refresh_show: false, // 下拉刷新复位
  },
  lifetimes: {
    // 组件实例进入节点树时执行
    async attached() {
      this.app = getApp();
      await this.get_data();
      this.triggerEvent("page_ready", true);
    },
  },
  methods: {
    // 跳转对应页面
    turn_to_page(e) {
      let page = e.currentTarget.dataset.page;
      let from_child = (res) => {
        // 解析从子页面传递的数据
        switch (res.type) {
          case "confirm":
            this.order_list = res.data;
            this.setData({
              confirm_num: this.order_list.length,
            });
            break;
        }
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
          break
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
    async get_data() {
      // 查询订单
      let r1 = this.app
        .mycall("orders", {
          type: "get",
          condition: {
            status: 0, //查询待确认订单
          },
        })
        .then(({ data: res }) => {
          this.order_list = res || [];
        });
      // 查询打开程序当天之后的所有已确认订单
      let t = new Date();
      let r2 = this.app
        .mycall("orders", {
          type: "get",
          condition: {
            status: 1, //查询已确认订单
            start: `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`,
          },
        })
        .then(({ data: res }) => {
          this.active_orders = res || [];
        });
      await Promise.all([r1, r2]).catch();
      this.setData({
        confirm_num: this.order_list.length, //订单数量
        calendar_num: this.active_orders.length, // 未来的已确认订单
        refresh_show: false,
      });
    },
  },
});
