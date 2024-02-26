Page({
  data: {
    // 图例
    legend: [{ title: "预约日期", icon: "icon1" }],
    weeks: ["日", "一", "二", "三", "四", "五", "六"], //星期
    date_list: [], // 日期列表
    date_boundary: 0, // 当天之前的所有天数全部灰掉
  },
  onLoad() {
    // 一加载就生成当月及下月日期列表
    this.init_day_list();
    this.channel = this.getOpenerEventChannel();
    this.channel.on("customer_list", (data) => {
      // 遍历订单列表 往date_list上添加样式及详细数据
      for (let o of data) {
        for (let d of this.data.date_list) {
          // 先根据已生成日期列表找处在哪个月
          if (o.start >= d.month_date.start && o.start <= d.month_date.end) {
            // 处在当前月 则遍历当月每一天时间戳 找到对应天
            for(let d2 of d.days){
              // 为了避免重复添加 要验证是否已经存在相同订单
              if (d2.date === o.start) {
                
                break
              }
            }
            break
          }
        }
      }
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
        start: new Date(`${year}-${month}-1`).getTime(),
        end: new Date(`${year}-${month}-${total_day}`).getTime(),
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
});
