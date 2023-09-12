Page({
  data: {
    path: [
      { name: "相册", value: "photos" },
      { name: "房间", value: "room_photo" },
    ],
    save_path: "", //存储路径
    select_photo: "", //选中的图片
    img_list: [], //文件列表
  },
  async onLoad(options) {
    this.app = getApp();
    this.channel = this.getOpenerEventChannel();
    this.setData({
      save_path: this.data.path[0].value,
    });
    // 一开打页面先查一次相册文件列表
    this.get_files();
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "upload_photo",
    });
  },
  // 切换选择上传路径 同时刷新图片列表
  select_photo_save(e) {
    this.setData({
      save_path: e.detail.value,
    });
    this.get_files();
  },
  // 上传图片并存储文件路径到数据库
  async upload_photo() {
    return;
    let res = await wx
      .chooseMedia({
        maxDuration: 60,
      })
      .catch((err) => "err");
    if (res !== "err") {
      this.app.upload(res.tempFiles, this.save_path);
    }
  },
  // 查询文件列表
  async get_files(file_name) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let params = {
      cloud_path: this.data.save_path,
    };
    if (typeof file_name === "string") {
      params.file_name = file_name;
    }
    let { data } = await this.app.mycall("files", {
      type: "get",
      params,
    });
    this.setData({
      img_list: data || [],
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 300);
  },
});
