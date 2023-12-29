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
      { title: "上传图片", icon: "icon-mn_shangchuantupian_fill", page: "upload_photo" },
    ],
    confirm_num: 0, //待确认订单数
  },
  lifetimes: {
    // 组件实例进入节点树时执行
    attached() {
      this.app = getApp();
      // 临时 生成确认订单
      let st = new Date("2023/7/1");
      let et = new Date("2023/7/7");
      this.list = [];
      for (let index = 0; index < 10; index++) {
        let t = {
          name: "张三",
          start_time: st.getTime(),
          end_time: et.getTime(),
          room: ["A01", "A02"],
        };
        this.list.push(t);
      }
      this.setData({
        confirm_num: this.list.length,
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
      // 跳转页只负责把获取的所有数据对应传入页面
      let send_to_child;
      switch (page) {
        case "confirm":
          send_to_child = (res) => {
            res.eventChannel.emit("comfirm_list", this.list);
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
