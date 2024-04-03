Page({
  data: {
    // 图例
    legend: [{ title: "预约日期", icon: "icon1" }],
    weeks: ["日", "一", "二", "三", "四", "五", "六"], //星期
    date_list: [], // 日期列表
    date_boundary: 0, // 当天之前的所有天数全部灰掉
    pop_show: false, // 显示弹窗
    day_user_order: [], // 当日用户以及订单列表
  },
  onLoad() {
    this.app = getApp();
    this.one_day = 24 * 60 * 60 * 1000;
    this.channel = this.getOpenerEventChannel();
    this.channel.on("customer_list", (data) => {
      // 在拿到数据后再渲染日期列表
      // 因为count_day只会在初次生成单月列表时调用
      // 利用这点可以避免每次都要循环遍历总日期列表 而且省去了验证每个订单在每月每日中唯一性
      // 遍历订单列表 往date_list上添加样式及详细数据
      console.log("日历", data);
      this.orders = data;
      this.init_day_list();
    });
  },
  // 生成当月和下月的日期列表
  init_day_list() {
    let list = [];
    let nowd = new Date();
    list.push(this.count_day(nowd));
    // 小于当天00点时间戳前的天灰掉
    this.setData({
      date_boundary: new Date(
        `${nowd.getFullYear()}/${nowd.getMonth() + 1}/${nowd.getDate()}`
      ).getTime(),
    });
    // 下个月一号
    let d = nowd.getMonth() + 1;
    let nextd;
    // 边界条件判断 如果是12月就是年份加1 否则月份加1
    if (d === 12) {
      nextd = new Date(`${nowd.getFullYear() + 1}/1/1`);
    } else {
      nextd = new Date(`${nowd.getFullYear()}/${d + 1}/1`);
    }
    list.push(this.count_day(nextd));
    this.setData({
      date_list: list,
    });
  },
  // 根据传入的Date对象生成对应月的天数列表
  count_day(date) {
    // 记录下后面用得到
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let total_day = new Date(year, month, 0).getDate(); //获取当月总天数
    let t = {
      title: `${year}年${month}月`,
      days: [],
      // 先按月分大类 便于快速筛选出在范围内的日期 当月1号00点时间戳
      month_date: {
        start: new Date(`${year}/${month}/1`).getTime(),
        end: new Date(`${year}/${month == 12 ? "1" : month + 1}/1`).getTime(),
      },
    };
    // 推算当月一号的时间
    if (day > 1) {
      let d = date.getTime() - (day - 1) * 24 * 60 * 60 * 1000;
      date = new Date(d);
    }
    let cur_week = date.getDay(); //获取当月1号是周几
    // 当月1号以前的日期用空格代替
    for (let index = 0; index < cur_week; index++) {
      t.days.push({
        date: 0,
        text: "",
      });
    }
    // 将当月日期填入
    for (let index = 1; index <= total_day; index++) {
      let d = new Date(`${year}/${month}/${index}`);
      let d2 = {
        date: d.getTime(), // 年月日下的时间戳
        text: index, // 日期文字
        orders: [], // 存当天的订单列表
      };
      t.days.push(d2);
    }
    // 计算剩余天数 剩余天数用空格
    let last = 35 - t.days.length;
    for (let index = 0; index < last; index++) {
      t.days.push({
        date: 0,
        text: "",
      });
    }
    // 返回前根据订单列表 将当月的订单加到对应天里
    for (let o of this.orders) {
      if (o.start >= t.month_date.start && o.start < t.month_date.end) {
        // 只遍历中间有日期的
        for (let i = cur_week; i < total_day + cur_week; i++) {
          let ii = t.days[i];
          // 不能对比时间戳 因为服务端生成的总是当天8点
          // 所以对比的是前端生成的当天00点到第二天00点时间戳范围
          if (o.start >= ii.date && o.start <= ii.date + this.one_day) {
            ii.orders.push(o);
            // 一个订单只会对应一天 当找到对应的日期 就应该跳过剩余的天数
            break;
          }
        }
      }
    }
    return t;
  },
  // 滑动到底部增加一个月
  add_month() {
    let list = this.data.date_list;
    // 获取数组末尾日期
    let d = list[list.length - 1].days[15].date; //取中间的一个日期肯定有值
    let last = new Date(d);
    // 生成下个月日期对象
    let d2 = last.getMonth() + 1;
    let next;
    if (d2 === 12) {
      next = new Date(`${last.getFullYear() + 1}/1/1`);
    } else {
      next = new Date(`${last.getFullYear()}/${d2 + 1}/1`);
    }
    list.push(this.count_day(next));
    this.setData({
      date_list: list,
    });
  },
  // 查看当天的订单信息
  async check(e) {
    let { orders } = e.currentTarget.dataset;
    // 没有订单不继续执行
    if (!orders.length) {
      return;
    }
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    // 查询全部用户
    let { data: res } = await this.app.mycall("customer", {
      type: "get",
      condition: {},
    });
    wx.hideLoading();
    if (res) {
      let list = [];
      for (let val of res) {
        // 因为要把用户下所有当日订单找出来 所以每一个订单都要遍历
        for (let val2 of orders) {
          if (val._id === val2.customer_id) {
            // 找到当日订单中的用户后 查看是否在list中已经存在
            // 存在则往用户所属订单下填充 不存在则创建用户信息及初始订单
            let find = false;
            for (let val3 of list) {
              if (val3.id === val._id) {
                find = val3.orders;
                break;
              }
            }
            let et = new Date(val2.end);
            let child = {
              end_to: `~ ${et.getFullYear()}.${
                et.getMonth() + 1
              }.${et.getDate()}`,
              pet_name: val2.pet_name.join("、"),
              cost: val2.cost,
              room: this.format_room_text(val2.room),
            };
            if (!find) {
              let t = {
                id: val._id,
                name: val.name,
                phone: val.phone,
                remark: val.remark,
                orders: [child],
              };
              list.push(t);
            } else {
              find.push(child);
            }
          }
        }
      }
      this.setData({
        pop_show: true,
        day_user_order: list,
      });
    }
  },
  // 复制一行内容到剪贴板
  async copy_content(e) {
    let data = e.currentTarget.dataset.content;
    await wx.setClipboardData({ data });
    wx.showToast({ title: "已复制到剪贴板", icon: "none" });
    setTimeout(() => {
      wx.hideToast();
    }, 1000);
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
          return "无";
        }
    }
  },
});
