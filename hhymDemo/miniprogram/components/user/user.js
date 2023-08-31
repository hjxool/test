Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    pop_show: false, //显示弹窗
    pop_hide: true, //隐藏弹窗动画
    cur_page: 0, // 当前页
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 显示|隐藏弹窗
    popup(event) {
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
        // 如果是日历弹窗关闭改变传入时间组件的参数
        if (event.detail.source === "calendar") {
          let dom = this.selectComponent("#select_time");
          let app = getApp();
          let st = app.globalData.start_time;
          let et = app.globalData.end_time;
          dom.setData({
            start_date: new Date(st),
            end_date: new Date(et),
          });
          // 计算开始到结束相隔几天
          let d = Math.ceil((et - st) / (24 * 60 * 60 * 1000));
          let dom2 = this.selectComponent("#house_type");
          dom2.setData({
            "list[0].price": d >= 20 ? 88 * 0.6 : 88,
            "list[1].price": d >= 20 ? 118 * 0.6 : 118,
          });
        }
      } else if (event.detail.type === "open pop") {
        this.setData({
          pop_show: true,
          pop_hide: false,
        });
      }
    },
    // 底部导航栏跳转
    nav_bar(e) {
      this.setData({
        cur_page: e.detail,
      });
    },
  },
});
