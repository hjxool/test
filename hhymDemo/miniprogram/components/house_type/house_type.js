Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    // 房间类型 及均价
    list: [
      {
        name: "普通房",
        img: "img1",
        price: "",
      },
      {
        name: "豪华房",
        img: "img2",
        price: "",
      },
    ],
  },
  lifetimes: {
    async attached() {
      this.app = getApp();
      // 组件一加载就获取设置的房间价格
      let res = await this.app.mycall("set_price");
      if (res && res.data) {
        // 存一下基础价格和优先规则
        this.base_price1 = res.data.price1;
        this.base_price2 = res.data.price2;
        this.month_day = res.data.month_day;
        this.month_discount = res.data.month_discount;
        this.half_month_day = res.data.half_month_day;
        this.half_month_discount = res.data.half_month_discount;
        // 初次加载组件都只有1天设置基础价格即可
        this.setData({
          "list[0].price": res.data.price1,
          "list[1].price": res.data.price2,
        });
      }
    },
  },
  methods: {
    // 跳转到房间详情页
    turn_to_house(e) {
      wx.navigateTo({
        url: "/pages/house/house",
      });
    },
    // 查询计价规则 并根据 全局变量的入住结束时间 计算显示的均价
    async calculate_average_price() {
      let start = this.app.globalData.start_time;
      let end = this.app.globalData.end_time;
      let d = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
      if (d > this.month_day) {
        // 达到优先规则条件 则不计算计价规则
        this.setData({
          "list[0].price": this.base_price1 * this.month_discount,
          "list[1].price": this.base_price2 * this.month_discount,
        });
      } else if (d <= this.month_day && d > this.half_month_day) {
        this.setData({
          "list[0].price": this.base_price1 * this.half_month_discount,
          "list[1].price": this.base_price2 * this.half_month_discount,
        });
      } else {
        // 小于半月天数的根据计价规则计算
        if (!this.rule_list) {
          // 如果没查过计价规则列表
          let { data } = await this.app.mycall("rule_list");
          this.rule_list = data;
        }
        // 计算方式 遍历规则列表 挨个对比 所选日期 是否在 规则时间段内 如果匹配则应用规则内价格
        // 有几天算几天 跟基础价格相加再除以对应天数得到均价
        // 注意规则列表里存的是时间戳
        for (let val of this.rule_list) {
          // 结束日期是离店日 不算规则时间
          if (start >= val.start && start < val.end) {
            // 开始时间在范围内则计算离结束有几天
            let d = Math.ceil((val.end - start) / (24 * 60 * 60 * 1000));
            d * val.price;
          }
          if (end > val.start && end <= val.end) {
            // 结束时间在范围内则计算经过了几天
            let d = Math.ceil((end - val.start) / (24 * 60 * 60 * 1000));
            d * val.price;
          }
          // 以上是包含的情况
        }
      }
    },
  },
});
