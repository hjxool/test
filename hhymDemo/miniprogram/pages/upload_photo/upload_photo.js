Page({
  data: {
    path: [
      { name: "相册", value: "photos" },
      { name: "房间", value: "room_photo" },
    ],
    save_path: "", //存储路径
    select_photo: "", //选中的图片
    img_list: [], //文件列表
    refresh_show: false, // 下拉刷新复位
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
  // 切换选择上传路径 同时刷新图片列表
  select_photo_save(e) {
    this.setData({
      save_path: e.detail.value,
      select_photo: "",
    });
    this.get_files();
  },
  // 选中图片
  select_photo(e) {
    // 选中的时候就要存一下当前对象
    this.cur_img = e.currentTarget.dataset.img;
    let name = e.currentTarget.dataset.img.file_name;
    if (this.data.select_photo === name) {
      this.setData({
        select_photo: "",
      });
    } else {
      this.setData({
        select_photo: name,
      });
    }
  },
  // 上传图片并存储文件路径到数据库
  async upload_photo() {
    // 默认上传可选数为9
    let count = 9;
    // 如果是上传房间照片 则要限制和校验
    // 区分是上传还是更新 如果是上传 则不能超过13张
    if (
      this.data.save_path === this.data.path[1].value &&
      !this.data.select_photo
    ) {
      if (this.data.img_list.length >= 13) {
        wx.showToast({
          title: "房间照片最多13张",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 1500);
        return;
      }
      count = 13 - this.data.img_list.length;
    }
    if (this.data.select_photo) {
      // 如果有值就是更新对应图 此时只能上传一张
      // 记录当前选中图片的文件类型
      // let t = this.cur_img.file_path.split(".");
      let res = await wx
        .chooseMedia({
          maxDuration: 60,
          count: 1, //限制上传一张
        })
        .then((res) => {
          // res.tempFiles[0].file_name = `${this.cur_img.file_name}.${
          //   t[t.length - 1]
          // }`;
          res.tempFiles[0].file_name = `${this.cur_img.file_name}`;
          return res.tempFiles;
        })
        .catch((err) => "err");
      if (res !== "err") {
        await this.app.upload(res, this.data.save_path, "put");
        this.setData({
          select_photo: "",
        });
        this.get_files();
      }
    } else {
      // 如果是上传新图则可以多张 添加到列表末尾
      // 新增图片是在数组末尾添加 名称就是索引+1
      let name_start = this.data.img_list.length + 1;
      let res = await wx
        .chooseMedia({
          maxDuration: 60,
          count,
        })
        .then((res) => {
          for (let val of res.tempFiles) {
            // 截取文件类型
            // let t = val.tempFilePath.split(".");
            // let type = t[t.length - 1];
            // val.file_name = `${name_start}.${type}`;
            val.file_name = `${name_start}`;
            name_start++;
          }
          return res.tempFiles;
        })
        .catch((err) => "err");
      if (res !== "err") {
        await this.app.upload(res, this.data.save_path, "post");
        this.get_files();
      }
    }
  },
  // 查询文件列表
  async get_files() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let params = {
      cloud_path: this.data.save_path,
    };
    let { data } = await this.app.mycall("files", {
      type: "get",
      params,
    });
    this.setData({
      img_list: data || [],
      refresh_show: false,
    });
    wx.hideLoading();
  },
});
