Component({
  options: {
    addGlobalClass: true,
  },
  properties: {},
  data: {
    modules: [
      { title: "客户列表", icon: "icon-kehu", page: "customer" },
      { title: "订单列表", icon: "icon-quanbudingdan", page: "order" },
      { title: "计价规则", icon: "icon-guize", page: "price_rule" },
      { title: "单价设置", icon: "icon-tixianguize", page: "room_price" },
      { title: "收入统计", icon: "icon-shuzhuangtu", page: "income_count" },
    ],
    confirm_num: 0, //待确认订单数
    pop_show: false, //显示弹窗
    pop_hide: true, //隐藏弹窗动画
    pop: {
      photo: [
        { name: "相册", value: "/photos", check: true },
        { name: "房间", value: "/room_photo", check: false },
      ],
    },
  },
  lifetimes: {
    // 组件实例进入节点树时执行
    attached() {
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
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转对应页面
    turn_to_page(e) {
      let page = e.currentTarget.dataset.page;
      let fn2 = (data) => {
        // 刷新数据的时机 一是从其他页面返回时 二是扫码进入小程序时
        this.get_data();
      };
      // 跳转不同页面触发不同事件
      // 跳转页只负责把获取的所有数据对应传入页面
      let fn;
      switch (page) {
        case "confirm":
          fn = (res) => {
            res.eventChannel.emit("comfirm_list", this.list);
          };
          break;
        case "calendar":
        case "customer":
          fn = (res) => {
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
          fn = (res) => {
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
          fn = (res) => {
            res.eventChannel.emit("order_list", "");
          };
          break;
        default:
          fn = (res) => {};
          break;
      }
      wx.navigateTo({
        url: `/pages/${page}/${page}`,
        events: {
          message: fn2,
        },
        success: fn,
      });
    },
    // 刷新页面数据
    get_data() {
      console.log("refresh");
    },
    // 打开弹窗
    open_pop(e) {
      let pop = e.currentTarget.dataset.pop;
      switch (pop) {
        case "upload_photo":
          this.save_path = this.data.pop.photo[0].value;
          this.setData({
            pop_show: true,
            pop_hide: false,
          });
          return;
      }
    },
    // 关闭弹窗
    close_pop() {
      this.setData({
        pop_hide: true,
      });
      // 放完动画再销毁
      setTimeout(() => {
        this.setData({
          pop_show: false,
        });
      }, 300);
    },
    // 切换选择上传路径
    select_photo_save(e) {
      this.save_path = e.detail.value;
    },
    // 上传图片并存储文件路径到数据库
    upload_photo() {
      
    },
  },
});
