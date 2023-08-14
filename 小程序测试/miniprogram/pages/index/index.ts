Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '修改前数据',
    show: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('onLoad')
    // console.log(this.data.msg)
    // 没有数据代理
    // this.data.msg = '11111'
    this.setData({
      msg: '修改后数据'
    })
    // console.log(this.data.msg)
    this.app = getApp()
  },
  // 绑定事件
  // 子元素事件
  fn1(e) {
    console.log(111)
  },
  // 父元素事件
  fn2(e) {
    // console.log(e) // 事件对象只有简单的定位
    // 获取节点详细信息
    let query = this.createSelectorQuery()
    let d = query.select('.a')
    console.log('查看获取的节点元素', d)
    // 获取相对页面的绝对定位
    d.boundingClientRect(res => {
      console.log('绝对定位', res)
    })
    // 获取滚动距离
    d.scrollOffset(res => {
      console.log('滚动距离', res)
    })
    query.exec()// 注意必须执行这一步才可以
  },
  // 阻止冒泡事件 跳转页面
  fn3() {
    console.log(333)
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
    // wx.redirectTo({
    //   url:'/pages/logs/logs'
    // })
    // wx.reLaunch({
    //   url:'/pages/logs/logs'
    // })
  },
  // 跳转测试用户信息
  fn4() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo'
    })
  },
  // 跳转轮播
  fn5() {
    wx.navigateTo({
      url: '/pages/swiper/swiper'
    })
  },
  // 返回内容
  fn6(pp: string): string {
    return pp
  },
  // 测试能否收到额外参数
  fn7(event, p) {
    console.log(event, p)
  },
  // 跳转测试页面通信
  fn8() {
    // 测试存数据到App实例
    this.app.pageInfo('参数1', '参数2')
    wx.navigateTo({
      url: '/pages/pageInfo/pageInfo',
      events: {
        sonToFather(data) {
          console.log('index页收到的数据', data)
        }
      },
      success(res) {
        console.log('成功回调', res)
        // 向被打开页发送数据
        res.eventChannel.emit('fatherToSon', '我是index页')
      }
    })
  },
  // {{ }}语法能使用函数返回值吗
  fn9(){
    return 'asdasd'
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(opts): WechatMiniprogram.Page.ICustomShareContent {
    console.log('onShareAppMessage')
    console.log(opts.target)
    return {}
  }
})