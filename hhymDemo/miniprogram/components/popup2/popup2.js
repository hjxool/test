Component({
  options: {
    addGlobalClass: true, //应用app.wxss样式
  },
  properties: {
    show: false,
  },
  data: {
    pop_hide: false, //隐藏显示动画
  },
  methods: {
    // 关闭弹窗
    close() {
      // 先放消失动画
      this.setData({
        pop_hide: true,
      });
      // 再销毁
      setTimeout(() => {
        this.setData({
          show: false,
          pop_hide: false,
        });
        this.triggerEvent("close_pop", {
          type: "close",
        });
      }, 300);
    },
  },
});
