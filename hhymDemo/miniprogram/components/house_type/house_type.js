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
      this.triggerEvent("is_ready", {
        type:'house_type'
      });
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
      let total_day = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
      if (total_day > this.month_day) {
        // 达到优先规则条件 则不计算计价规则
        this.setData({
          "list[0].price": this.base_price1 * this.month_discount,
          "list[1].price": this.base_price2 * this.month_discount,
        });
      } else if (
        total_day <= this.month_day &&
        total_day > this.half_month_day
      ) {
        this.setData({
          "list[0].price": this.base_price1 * this.half_month_discount,
          "list[1].price": this.base_price2 * this.half_month_discount,
        });
      } else {
        // 小于半月天数的根据计价规则计算
        if (!this.rule_list) {
          // 如果没查过计价规则列表
          let { data } = await this.app.mycall("rule_list", { type: "get" });
          this.rule_list = data;
        }
        // 计算方式 遍历规则列表 挨个对比 所选日期 是否在 规则时间段内 如果匹配则应用规则内价格
        // 有几天算几天 跟基础价格相加再除以对应天数得到均价
        // 注意规则列表里存的是时间戳
        let rule_price1 = 0; //标间规则价累加
        let rule_price2 = 0; //豪华间规则价累加
        let rule_day = 0; //经过了多少个规则 除此以外的天数都是普通价
        for (let val of this.rule_list) {
          if (start >= val.end) {
            continue;
          }
          let d;
          // 规则不会交叠 所选开始小于规则结束且大于等于规则开始的只会有一个
          if (start >= val.start) {
            //所选开始在内 判断所选结束在内还是外
            if (end <= val.end) {
              // 所选在内 计算规则价格
              d = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
            } else {
              // 所选结束大于规则结束 计算在当前规则内重叠的天数
              d = Math.ceil((val.end - start) / (24 * 60 * 60 * 1000));
            }
          } else {
            // 所选开始小于规则开始 说明所选开始不在当前规则内
            // 则继续判断所选结束是否在当前规则内
            if (end <= val.end && end > val.start) {
              d = Math.ceil((end - val.start) / (24 * 60 * 60 * 1000));
            } else {
              // 所选结束不在当前规则内 则判断是小于规则开始还是大于规则结束
              if (end <= val.start) {
                // 小于当前规则开始 说明在规则前结束 跳出循环
                break;
              } else if (end >= val.end) {
                // 大于当前规则结束 说明覆盖了全部天数
                d = Math.ceil((val.end - val.start) / (24 * 60 * 60 * 1000));
              } else {
                // 在当前规则中 计算覆盖的天数
                d = Math.ceil((end - val.start) / (24 * 60 * 60 * 1000));
              }
            }
          }
          rule_price1 += d * val.price1;
          rule_price2 += d * val.price2;
          rule_day += d;
        }
        let total_price1 =
          (total_day - rule_day) * this.base_price1 + rule_price1;
        let total_price2 =
          (total_day - rule_day) * this.base_price2 + rule_price2;
        // 记录到全局变量中 用于在提交订单时 用单只对应房间总价加上如果有多只的价格得到订单总价
        this.app.globalData.single_total_price1 = total_price1;
        this.app.globalData.single_total_price2 = total_price2;
        // 计算标间和豪华间均价
        this.setData({
          "list[0].price": Math.round((total_price1 / total_day) * 10) / 10,
          "list[1].price": Math.round((total_price2 / total_day) * 10) / 10,
        });
      }
    },
  },
});
