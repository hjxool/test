Page({
  data: {
    form: {
      name: "", //联系人
      phone: "", //手机号
      pet: [], //住店宠物
      start: "", //日期
      end: "", //日期
      room: "", //房间
      know_from: "", //从何知道好好养猫家
      total_day: "", //共几天
      is_read: false, //是否阅读了用户协议
    },
    room_type: 0, //房间类型 豪华间最多四个 普通间最多2个
    total_price: 0, //合计总价
    pop_show: false, //显示弹窗
    pop_hide: true, //隐藏弹窗动画
  },
  async onLoad(options) {
    this.app = getApp();
    this.channel = this.getOpenerEventChannel();
    // 读取时间
    let start = new Date(this.app.globalData.start_time);
    let end = new Date(this.app.globalData.end_time);
    // 读取房间id 判断是豪华还是标间
    let room_type;
    let room_name;
    switch (this.app.globalData.room) {
      case "3":
        room_type = 1;
        room_name = "豪华间1";
        break;
      case "11":
        room_type = 1;
        room_name = "豪华间2";
        break;
      default:
        room_type = 0;
        if (
          this.app.globalData.room == "1" ||
          this.app.globalData.room == "2"
        ) {
          room_name = `标准间${this.app.globalData.room}`;
        } else if (
          Number(this.app.globalData.room) >= 4 &&
          Number(this.app.globalData.room) <= 10
        ) {
          room_name = `标准间${Number(this.app.globalData.room) - 1}`;
        } else if (
          this.app.globalData.room == "2" ||
          this.app.globalData.room == "13"
        ) {
          room_name = `标准间${Number(this.app.globalData.room) - 2}`;
        }
        break;
    }
    // 读取当前客户信息看是否有记录 有则读取他的宠物信息自动填入计算价格 没有则显示默认价格
    // 提交订单时根据当前用户的openid修改原先的联系人等信息 有记录时读取这些信息
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    this.customer_type = "post";
    let {
      data: [customer],
    } = await this.app.mycall("customer", { type: "get" });
    // 数据库里宠物列表没有短名
    let pet = [];
    if (customer) {
      pet = customer.pets;
      // 如果数据库中存在当前用户 则为更新 否则新增
      this.customer_type = "put";
    }
    // 记录用户备注名
    this.user_remark = customer?.remark || "";
    this.setData({
      "form.pet": pet.map((e) => {
        e.short = e.name.split("")[0];
        return e;
      }),
      "form.start": `${start.getFullYear()}.${
        start.getMonth() + 1
      }.${start.getDate()}`,
      "form.end": `${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()}`,
      "form.total_day": Math.ceil(
        (this.app.globalData.end_time - this.app.globalData.start_time) /
          (24 * 60 * 60 * 1000)
      ),
      room_type,
      "form.room": room_name,
      "form.name": customer?.name || "",
      "form.phone": customer?.phone || "",
      "form.know_from": customer?.know_from || "",
    });
    // 查询设置的房价
    let { data: res } = await this.app.mycall("set_price");
    wx.hideLoading();
    if (res) {
      // 存一下基础价格和优先规则
      this.base_price = room_type ? res.price2 : res.price1;
      // base_price1和2是 更新全局单只总价的
      this.base_price1 = res.price1;
      this.base_price2 = res.price2;
      this.month_day = res.month_day;
      this.month_discount = res.month_discount;
      this.half_month_day = res.half_month_day;
      this.half_month_discount = res.half_month_discount;
    } else {
      this.tip("网络异常");
      this.err = true;
      // 不往后继续执行计价方法
      return;
    }
    // 根据房间类型 记录总价
    // 如果用户没有点击日历选择入住时间 single_total_price就没有值
    // 所以这里需要用读取的基础房价
    if (!this.app.globalData.single_total_price1) {
      this.app.globalData.single_total_price1 = res.price1;
      this.app.globalData.single_total_price2 = res.price2;
    }
    this.single_price = room_type
      ? this.app.globalData.single_total_price2
      : this.app.globalData.single_total_price1;

    this.calculate_cost();
  },
  // 勾选阅读协议
  is_read() {
    this.setData({
      "form.is_read": !this.data.form.is_read,
    });
  },
  // 跳转协议、和宠物详情页
  turn_to_page(e) {
    let page = e.currentTarget.dataset.page;
    let body = {
      url: `/pages/${page}/${page}`,
    };
    switch (page) {
      case "pet":
        // 监听宠物页确认编辑传回的数据
        body.events = {
          pet_data: (res) => {
            console.log("表单:", res);
            // short用于图标显示 只取第一个字
            if (res.data.name) {
              res.data.short = res.data.name.split("")[0];
            } else {
              res.data.short = "";
            }
            switch (res.type) {
              case "add":
                for (let val of this.data.form.pet) {
                  if (val.name === res.data.name) {
                    this.tip("宠物名重复了哦");
                    return;
                  }
                }
                this.data.form.pet.push(res.data);
                break;
              case "edit":
                for (let i = 0; i < this.data.form.pet.length; i++) {
                  // 除了自身查看是否有同名
                  if (
                    i !== res.index &&
                    this.data.form.pet[i] === res.data.name
                  ) {
                    this.tip("宠物名重复了哦");
                    return;
                  }
                }
                this.data.form.pet.splice(res.index, 1, res.data);
                break;
              case "del":
                this.data.form.pet.splice(res.index, 1);
                break;
            }
            this.setData({
              "form.pet": this.data.form.pet,
            });
            // 每次宠物列表变动都计算一次价格
            this.calculate_cost();
          },
        };
        // 如果是编辑而不是新增则传入数据
        let index = e.currentTarget.dataset.index;
        if (index >= 0) {
          // 有索引值说明点击的是编辑
          body.success = (res) => {
            // 编辑时传 当前 位置索引过去 且不能将索引写死在宠物对象中 因为可能会删除中间项 导致索引错误
            res.eventChannel.emit("pet_data", {
              data: this.data.form.pet[index],
              index: index,
            });
          };
        }
        break;
    }
    wx.navigateTo(body);
  },
  // 失去焦点保存值
  save_value(e) {
    let key = e.currentTarget.dataset.item;
    if (key === "phone") {
      // 校验手机号
      let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg.test(e.detail.value)) {
        this.tip("请填写正确的号码");
      }
    }
    this.setData({
      [`form.${key}`]: e.detail.value,
    });
  },
  // 从宠物列表中移除
  del_pet(e) {
    let index = e.currentTarget.dataset.index;
    this.data.form.pet.splice(index, 1);
    this.setData({
      "form.pet": this.data.form.pet,
    });
    this.calculate_cost();
  },
  // 计算总价
  calculate_cost() {
    let d = this.data.form.total_day;
    let num = this.data.form.pet.length; //第一只是正常价 多一只加30
    if (!num) {
      // 没有填写宠物时不计算 为0
      this.setData({
        total_price: 0,
      });
      return;
    }
    if (d > this.month_day) {
      this.setData({
        total_price:
          Math.floor(
            (this.base_price + 30 * (num - 1)) * d * this.month_discount * 10
          ) / 10,
      });
    } else if (d <= this.month_day && d > this.half_month_day) {
      this.setData({
        total_price:
          Math.floor(
            (this.base_price + 30 * (num - 1)) *
              d *
              this.half_month_discount *
              10
          ) / 10,
      });
    } else {
      // 全局变量已经存了单只的总价 还要计算多只*总天数价格
      this.setData({
        total_price:
          Math.floor((this.single_price + 30 * (num - 1) * d) * 10) / 10,
      });
    }
  },
  //#region
  // 设置提交是否可用
  // disable(t = false) {
  //   if (!t) {
  //     // 如果宠物列表为空、必填项没写不能提交
  //     if (!this.data.form.pet.length) {
  //       this.tip("请填写宠物信息再提交");
  //       t = true;
  //     }
  //     if (!this.data.form.name.length) {
  //       this.tip("请填写联系人");
  //       t = true;
  //     }
  //     if (!this.data.form.phone.length) {
  //       this.tip("请填写联系电话");
  //       t = true;
  //     }
  //   }
  //   this.setData({
  //     err: t,
  //   });
  // },
  //#endregion
  // 提示信息
  tip(msg) {
    wx.showToast({
      title: msg,
      icon: "none",
    });
    setTimeout(() => {
      wx.hideToast();
    }, 1500);
  },
  // 提交预约
  async submit() {
    if (this.err) {
      this.tip("网络异常不能提交");
      return;
    }
    if (!this.data.form.pet.length) {
      this.tip("请填写宠物信息再提交");
      return;
    }
    if (!this.data.form.name.length) {
      this.tip("请填写联系人");
      return;
    }
    let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!reg.test(this.data.form.phone)) {
      this.tip("请填写正确的号码");
      return;
    }
    if (!this.data.form.is_read) {
      this.tip("请阅读并勾选服务协议");
      return;
    }
    // 此处提交完整数据给接口 再由接口拆分成用户数据(全部数据)和订单数据(部分) 并做用户ID和订单ID之间的关联
    wx.showLoading({
      title: "订单提交中",
      mask: true,
    });
    // 不需要传用户id，由后端接口获取并写入
    let { name, phone, pet, know_from } = this.data.form;
    let st = new Date(this.app.globalData.start_time);
    let et = new Date(this.app.globalData.end_time);
    let res = await this.app.mycall("reserve", {
      type: this.customer_type,
      params: {
        name,
        phone,
        // 发送请求时不需要短名参数
        pet: pet.map((e) => {
          let t = {};
          for (let key in e) {
            // 把short字段剔除
            if (key !== "short") {
              t[key] = e[key];
            }
          }
          return t;
        }),
        // 表单里显示的开始和结束时间是.连接的 不能用
        // 全局变量里存的是时间戳
        start: `${st.getFullYear()}/${st.getMonth() + 1}/${st.getDate()}`,
        end: `${et.getFullYear()}/${et.getMonth() + 1}/${et.getDate()}`,
        room: this.app.globalData.room,
        know_from,
        cost: this.data.total_price,
        remark: this.user_remark, // 用户每次提交订单都携带备注名
      },
    });
    wx.hideLoading();
    // 如果未成功提交则保持在当前页
    if (res.code !== 200) {
      return;
    }
    // 提交完返回首页并关闭遮罩
    setTimeout(() => {
      wx.navigateBack();
    }, 500);
  },
  // 打开日历
  show_calendar() {
    this.app.globalData.pop_content = "calendar";
    this.setData({
      pop_show: true,
      pop_hide: false,
    });
  },
  // 显示|隐藏弹窗
  async popup(event) {
    if (event.detail.type === "close pop") {
      this.setData({
        pop_hide: true,
      });
      // 放完动画再销毁
      setTimeout(() => {
        this.setData({
          pop_show: false,
        });
      }, 300);
      // 如果是日历弹窗关闭改变页面显示的起止时间 和总天数
      // 提交的时候是从全局变量中取时间戳 所以不用担心再次调日历时间会不一致
      if (event.detail.source === "calendar") {
        let st = new Date(this.app.globalData.start_time);
        let et = new Date(this.app.globalData.end_time);
        let td = Math.ceil(
          (et.getTime() - st.getTime()) / (24 * 60 * 60 * 1000)
        );
        this.data.form.total_day = td;
        this.setData({
          "form.start": `${st.getFullYear()}.${
            st.getMonth() + 1
          }.${st.getDate()}`,
          "form.end": `${et.getFullYear()}.${
            et.getMonth() + 1
          }.${et.getDate()}`,
          "form.total_day": this.data.form.total_day,
        });
        // 关闭日历弹窗后先判断是否需要重新计算单只总价
        await this.calculate_single_price();
        this.calculate_cost();
      }
    }
  },
  // 查询计价规则 并根据 全局变量的入住结束时间
  async calculate_single_price() {
    let total_day = this.data.form.total_day;
    if (total_day <= this.half_month_day) {
      // 小于半月天数的根据计价规则计算
      if (!this.app.globalData.rule_list) {
        // 如果没查过计价规则列表
        let { data } = await this.app.mycall("rule_list", { type: "get" });
        this.app.globalData.rule_list = data;
      }
      // 计算方式 遍历规则列表 挨个对比 所选日期 是否在 规则时间段内 如果匹配则应用规则内价格
      // 有几天算几天 跟基础价格相加再除以对应天数得到均价
      // 注意规则列表里存的是时间戳
      let rule_price1 = 0; //标间规则价累加
      let rule_price2 = 0; //豪华间规则价累加
      let rule_day = 0; //经过了多少个规则 除此以外的天数都是普通价
      for (let val of this.app.globalData.rule_list) {
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
      this.single_price = this.data.room_type ? total_price2 : total_price1;
    }
  },
});
