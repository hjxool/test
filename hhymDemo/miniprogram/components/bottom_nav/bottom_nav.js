Component({
  options: {
    addGlobalClass: true,
  },
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
  methods: {
    // 选择跳转页
    async select_page(e) {
      let page = e.currentTarget.dataset.page;
      this.setData({
        selected: page,
      });
      this.triggerEvent("navevent", page);
    },
  },
});
