Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    type: "", //展示什么内容
    pop_hide: false, // 显示动画
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    date_list: [], // 日期列表
    date_boundary: 0, // 当天之前的所有天数全部灰掉
    start_day: -1, //入住开始时间
    end_day: -1, //入住结束时间
    tip: {
      month: 0, //日历提示
      half_month: 0, //日历提示
      price1: 0,
      price2: 0,
    },
    rule_form: {
      // 表单项
      items: [
        { label: "开始：", value: "" },
        { label: "结束：", value: "" },
        { label: "标间定价：", value: 0 },
        { label: "豪华间定价：", value: 0 },
      ],
      focus: -1, //输入框高亮样式
    },
  },
  lifetimes: {
    // 组件实例进入页面节点树时执行
    async attached() {
      this.app = getApp();
      this.setData({
        type: this.app.globalData.pop_content,
      });
      if (this.data.type === "calendar") {
        // 获取实时包月天数和半月天数
        let { data } = await this.app.mycall("set_price");
        // 一打开弹窗就读取入住时间
        this.setData({
          "tip.month": data.month_day,
          "tip.half_month": data.half_month_day,
          start_day: this.app.globalData.start_time,
          end_day: this.app.globalData.end_time,
          "tip.price1": data.price1,
          "tip.price2": data.price2,
        });
        // 初始化日历列表前 先查计价规则 生成日历的时候就将规则时间段内的价格标注出来
        let res2 = await this.app.mycall("rule_list");
        this.rule_list = res2.data;
        // 一加载组件就生成当月及下月日期列表
        this.init_day_list();
      }
    },
  },
  methods: {
    // 关闭弹窗
    close_pop(source) {
      this.setData({
        pop_hide: true,
      });
      // 有两种 一种是事件触发 一种是传入参数
      this.triggerEvent("popevent", {
        type: "close pop",
        source: source.currentTarget?.dataset.source || source,
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
      // 因为每过12个月会加一年 要判断传入日期在不在规则范围内只需要将时间跨度统一到月
      // 如果在 标记出是哪几个规则
      let rule_index = [];
      let i = 0;
      for (let val of this.rule_list) {
        let s = new Date(val.start);
        let e = new Date(val.end);
        let sm = s.getMonth() + 1;
        let em = e.getMonth() + 1;
        // 计算公式 ((结束年 - 开始年) - 1) * 12 + (12 - 开始月) + 结束月
        let current_month =
          (year - s.getFullYear() - 1) * 12 + (12 - sm) + month;
        let total_month =
          (e.getFullYear() - s.getFullYear() - 1) * 12 + (12 - sm) + em;
        if (current_month <= total_month && current_month >= 0) {
          // 以当前规则开始时间为基准 最小不能小于0 最大不能超过 规则范围
          rule_index.push(i);
        }
        i++;
      }
      let t = {
        title: `${year}年${month}月`,
        days: [],
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
          date: 0, //时间戳 0表示空格
          text: "", //显示日期文字
          price1: 0, //当天价格 0表示正常价格 不显示
          price2: 0,
        });
      }
      let total_day = new Date(year, month, 0).getDate(); //获取当月总天数
      // 将当月日期填入
      for (let index = 1; index <= total_day; index++) {
        let d = new Date(`${year}/${month}/${index}`);
        let d2 = {
          date: d.getTime(),
          text: index,
          price1: 0,
          price2: 0,
        };
        // 遍历可能的规则索引 匹配具体时间戳是否在范围内
        // 因为传入的日期是一整个月 所以每一个日期都有可能落在不同的规则里 因此每天都要遍历
        for (let val of rule_index) {
          let r = this.rule_list[val];
          if (d2.date >= r.start && d2.date < r.end) {
            d2.price1 = r.price1;
            d2.price2 = r.price2;
          }
        }
        t.days.push(d2);
      }
      // 计算剩余天数 剩余天数用空格
      let last = 35 - t.days.length;
      for (let index = 0; index < last; index++) {
        t.days.push({
          date: 0,
          text: "",
          price: 0,
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
    // 选择时间
    select_day(e) {
      let cur_date = e.currentTarget.dataset.date;
      // 选择时间只能是当天后的
      if (cur_date < this.data.date_boundary) {
        return;
      }
      // 首先开始时间不可能未选中(-1)
      // 结束时间已选再次选时间则是开始时间
      if (this.data.end_day !== -1) {
        // 特殊情况 再次点击开始或结束元素是 dataset中的值被清空
        // 是因为点到里层的元素上了
        this.setData({
          start_day: cur_date,
          end_day: -1,
        });
        return;
      }
      // 结束时间未选且选中时间小于开始时间
      if (this.data.end_day === -1 && cur_date <= this.data.start_day) {
        this.setData({
          start_day: cur_date,
        });
        return;
      }
      if (this.data.end_day === -1) {
        this.setData({
          end_day: cur_date,
        });
        return;
      }
    },
    // 确认保存所选时间
    confirm_time() {
      // 存的是时间戳
      this.app.globalData.start_time = this.data.start_day;
      this.app.globalData.end_time = this.data.end_day;
      this.close_pop("calendar");
    },
    // 新增规则表单输入框高亮
    add_focus(e) {
      this.setData({
        "rule_form.focus": e.currentTarget.dataset.index,
      });
    },
    // 失去高亮
    add_blur(e) {
      let data = {
        "rule_form.focus": -1,
      };
      let index = e.currentTarget.dataset.index;
      if (index === 2 || index === 3) {
        // 只有输入框失去焦点才取值
        data[`rule_form.items[${index}].value`] = e.detail.value;
      }
      this.setData(data);
    },
    // 新增规则表单 选择时间
    select_time(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        [`rule_form.items[${index}].value`]: e.detail.value,
      });
    },
    // 确认新增规则
    async confirm_add_rule() {
      let form = this.data.rule_form.items;
      let result = true;
      for (let val of form) {
        if (!val.value.length) {
          result = false;
          break;
        }
      }
      if (!result) {
        wx.showToast({
          title: "有未填写内容",
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 1000);
        return;
      }
      let data = {
        start: new Date(form[0].value).getTime(),
        end: new Date(form[1].value).getTime(),
        price1: Number(form[2].value),
        price2: Number(form[3].value),
      };
      // 开始时间不能大于结束时间
      if (data.start >= data.end) {
        wx.showToast({
          title: "开始时间不能大于等于结束时间，结束时间表示离店时间不计价",
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000);
        return;
      }
      let res = await this.app.mycall("rule_list", data);
      if (res) {
        this.close_pop("add_rule");
      }
    },
  },
});
