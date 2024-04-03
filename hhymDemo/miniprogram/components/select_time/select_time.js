Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    total: 1, //总共天数
    start_time_text: "08月29日", //开始时间格式化文字
    start_text: "", //提示今天、明天、后天、周几
    end_time_text: "08月30日", //结束时间格式化文字
    end_text: "",
    start_date: null, //开始日期对象
    end_date: null, //结束日期对象
  },
  lifetimes: {
    attached() {
      this.app = getApp();
      // 时间要跟日历里的统一
      let nowt = new Date();
      this.data.start_date = new Date(
        `${nowt.getFullYear()}/${nowt.getMonth() + 1}/${nowt.getDate()} 00:00:00`
      );
      this.app.globalData.start_time = this.data.start_date.getTime();
      let nextt = this.data.start_date.getTime() + 24 * 60 * 60 * 1000;
      this.app.globalData.end_time = nextt;
      this.data.end_date = new Date(nextt);
      this.setData({
        start_time_text: this.format_date_text(this.data.start_date),
        end_time_text: this.format_date_text(this.data.end_date),
        start_text: this.format_text(this.data.start_date),
        end_text: this.format_text(this.data.end_date),
      });
      this.triggerEvent("is_ready", {
        type:'select_time'
      });
    },
  },
  methods: {
    // 将date对象转换成日期文字返回
    format_date_text(date) {
      let m = date.getMonth() + 1;
      let d = date.getDate();
      return `${m < 10 ? "0" + m : m}月${d < 10 ? "0" + d : d}日`;
    },
    // 将date对象转换成对应当天、明天、后天、周几
    format_text(date) {
      let today = new Date();
      // 选择时间以当天00点为时间戳，所以不应该以当前时间戳推后24小时为分界
      // 以当前日期往后推一天为明天界限
      let tomorrow = new Date(
        `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() + 1}`
      ).getTime();
      let after_tomorrow = 24 * 60 * 60 * 1000 + tomorrow;
      let three_day = 24 * 60 * 60 * 1000 + after_tomorrow;
      let select_time = date.getTime();
      if (select_time < tomorrow) {
        return "今天";
      } else if (select_time >= tomorrow && select_time < after_tomorrow) {
        return "明天";
      } else if (select_time >= after_tomorrow && select_time < three_day) {
        return "后天";
      } else {
        // 超出后天开始计算是周几
        let week = date.getDay();
        switch (week) {
          case 0:
            return "周日";
          case 1:
            return "周一";
          case 2:
            return "周二";
          case 3:
            return "周三";
          case 4:
            return "周四";
          case 5:
            return "周五";
          case 6:
            return "周六";
        }
      }
    },
    // 打开日历
    show_calendar() {
      this.app.globalData.pop_content = "calendar";
      this.app.globalData.start_time = this.data.start_date.getTime();
      this.app.globalData.end_time = this.data.end_date.getTime();
      this.triggerEvent("popevent", {
        type: "open pop",
        source: "select_time",
      });
    },
  },
  observers: {
    // 当开始|结束日期发生变化重新计算总天数
    "start_date, end_date": function (start, end) {
      // 当天时间不是从00点开始，所以间隔时间(毫秒)除以一天应该向上取整
      let t = Math.ceil(
        (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
      );
      this.setData({
        total: t,
        start_time_text: this.format_date_text(start),
        end_time_text: this.format_date_text(end),
        start_text: this.format_text(start),
        end_text: this.format_text(end),
      });
    },
  },
});
