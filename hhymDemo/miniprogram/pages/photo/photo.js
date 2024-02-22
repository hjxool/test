Page({
  data: {
    list: [], //图片列表
    popup_img: "", // 弹窗图片
  },
  onLoad(options) {
    let channel = this.getOpenerEventChannel();
    channel.on("getPhotos", (data) => {
      this.setData({
        list: data,
      });
    });
  },
  // 放大显示图片
  zoom_in(e) {
    let { src } = e.currentTarget.dataset;
    this.setData({
      popup_img: src,
    });
  },
  // 弹窗组件事件
  close_pop(e) {
    if (e.detail.type === "close") {
      this.setData({
        popup_img: "",
      });
    }
  },
});
