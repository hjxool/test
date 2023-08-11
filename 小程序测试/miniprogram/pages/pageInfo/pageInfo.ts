// pages/pageInfo/pageInfo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  fn1() {
    console.log(this.app.cd)
  },
  fn2() {
    this.hhh.emit('sonToFather', '你好我是pageInfo页面')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // this.app = getApp()
    // 用页面通信功能实现
    this.hhh = this.getOpenerEventChannel()
    this.hhh.on('fatherToSon', res => {
      console.log('父向子传数据', res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})