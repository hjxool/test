Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    interval: 2000, //自动播放间隔
    duration: 1000, //停留时间
    img_list: ['img1', 'img2', 'img3'], //图片列表
    img_index: 1, //当前展示图片索引
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转相册
    turn_to() {
      wx.navigateTo({
        url: '/pages/photo/photo',
      }).then(res => {
        res.eventChannel.emit('getPhotos', this.data.img_list)
      })
    },
    // 当前页改变后获取当前页索引
    current_img(event) {
      let {
        current
      } = event.detail
      this.setData({
        img_index: current + 1
      })
    }
  }
})