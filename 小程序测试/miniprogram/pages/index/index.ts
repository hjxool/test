Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'修改前数据'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log(this.data.msg)
    // 没有数据代理
    // this.data.msg = '11111'
    this.setData({
      msg:'修改后数据'
    })
    console.log(this.data.msg)
  },
  // 绑定事件
  // 子元素事件
  fn1(){
    console.log(1111)
  },
  // 父元素事件
  fn2(){
    console.log(2222)
  },
  // 阻止冒泡事件 跳转页面
  fn3(){
    console.log(333)
    wx.navigateTo({
      url:'/pages/logs/logs'
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
  onShareAppMessage(opts): WechatMiniprogram.Page.ICustomShareContent {
    console.log(opts.target)
    return {}
  }
})