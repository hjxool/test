Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {},
  lifetimes: {
    // 组件实例进入页面节点树时执行
    attached() {
      let app = getApp();
      this.setData({
        type: app.globalData.pop_content,
      });
      if (this.data.type === "calendar") {
        // 一打开弹窗就读取入住时间
        this.setData({
          start_day: app.globalData.start_time,
          end_day: app.globalData.end_time,
        });
        // 一加载组件就生成当月及下月日期列表
        this.init_day_list();
      }
      if (this.data.type === "add_rule") {
        this.setData({
          "rule_form.rooms": JSON.parse(JSON.stringify(app.globalData.rooms)),
        });
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    type: "", //展示什么内容
    pop_hide: false, // 显示动画
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    date_list: [], // 日期列表
    date_boundary: 0, // 当天之前的所有天数全部灰掉
    start_day: -1, //入住开始时间
    end_day: -1, //入住结束时间
    rule_form: {
      // 表单项
      items: [
        { label: "开始：", value: "" },
        { label: "结束：", value: "" },
        { label: "定价：", value: 0 },
        { label: "房间：", value: [], all: 0 },
      ],
      focus: -1, //输入框高亮样式
      rooms: [], //全部房间列表
    },
  },

  /**
   * 组件的方法列表
   */
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
          date: 0,
          text: "",
        });
      }
      let total_day = new Date(year, month, 0).getDate(); //获取当月总天数
      // 将当月日期填入
      for (let index = 1; index <= total_day; index++) {
        let d = new Date(`${year}/${month}/${index}`);
        let d2 = {
          date: d.getTime(),
          text: index,
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
      let app = getApp();
      // 存的是时间戳
      app.globalData.start_time = this.data.start_day;
      app.globalData.end_time = this.data.end_day;
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
        "rule_form.focus": -1
      }
      if (e.currentTarget.dataset.index === 2) {
        // 只有输入框失去焦点才取值
        data["rule_form.items[2].value"] = e.detail.value
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
    // 全选房间
    all_room() {
      let t = this.data.rule_form.items[3];
      this.setData({
        "rule_form.items[3].all": t.all === 2 ? 0 : 2,
      });
      this.data.rule_form.items[3].value = [];
      if (t.all) {
        let list = this.data.rule_form.items[3].value;
        for (let val of this.data.rule_form.rooms) {
          val.check = true;
          list.push(val.label);
        }
        this.setData({
          "rule_form.rooms": this.data.rule_form.rooms,
        });
      } else {
        for (let val of this.data.rule_form.rooms) {
          val.check = false;
        }
        this.setData({
          "rule_form.rooms": this.data.rule_form.rooms,
        });
      }
    },
    // 单选房间
    select_room(e) {
      let { value } = e.detail;
      for (let val of this.data.rule_form.rooms) {
        for (let val2 of value) {
          if (val.label === val2) {
            val.check = true;
            break;
          }
        }
      }
      let item = this.data.rule_form.items[3];
      item.value = value;
      // 统计全选标识
      switch (true) {
        case value.length === this.data.rule_form.rooms.length:
          item.all = 2;
          break;
        case value.length > 0 &&
          value.length < this.data.rule_form.rooms.length:
          item.all = 1;
          break;
        case value.length === 0:
          item.all = 0;
          break;
      }
      this.setData({
        "rule_form.items[3].all": item.all,
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
      this.close_pop("add_rule");
    },
  },
});
