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
    // 导航栏
    navs: [
      {
        title: "预定",
        icon: "icon-yuding-active",
      },
      {
        title: "订单",
        icon: "icon-quanbudingdan",
      },
    ],
    // 导航栏选中项
    selected: 0, // 0第一项 1第二项
  },
  lifetimes: {
    attached() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 选择跳转页
    select_page(e) {
      let page = e.currentTarget.dataset.page;
      this.setData({
        selected: page,
      });
      this.triggerEvent("navevent", page);
    },
  },
});
