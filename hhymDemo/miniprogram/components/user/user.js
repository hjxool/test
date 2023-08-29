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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示|隐藏弹窗
    popup(event) {
      if (event.detail === "close pop") {
        this.setData({
          pop_hide: true,
        });
        // 放完动画再销毁
        setTimeout(() => {
          this.setData({
            pop_show: false,
          });
        }, 300);
      } else if (event.detail === "open pop") {
        this.setData({
          pop_show: true,
          pop_hide: false,
        });
      }
    },
  },
});
