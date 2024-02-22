Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    interval: 2000, //自动播放间隔
    duration: 1000, //停留时间
    img_list: [], //图片列表
    img_index: 1, //当前展示图片索引
  },
  lifetimes: {
    async attached() {
      this.app = getApp();
      // 组件一加载就获取相册列表
      let { data } = await this.app.mycall("files", {
        type: "get",
        params: {
          cloud_path: "photos",
        },
      });
      this.setData({
        img_list: data || [],
      });
      this.triggerEvent("is_ready", {
        type:'scroll_img'
      });
    },
  },
  methods: {
    // 跳转相册
    turn_to() {
      wx.navigateTo({
        url: "/pages/photo/photo",
      }).then((res) => {
        res.eventChannel.emit("getPhotos", this.data.img_list);
      });
    },
    // 当前页改变后获取当前页索引
    current_img(event) {
      let { current } = event.detail;
      this.setData({
        img_index: current + 1,
      });
    },
  },
});
