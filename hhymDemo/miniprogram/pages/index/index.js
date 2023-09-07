Page({

  /**
   * 页面的初始数据
   */
  data: {
    isManager: 2, // 0管理员 1普通用户 2加载时不显示
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '',
    })
    let {
      result
    } = await wx.login().then(async res => {
      wx.hideLoading()
      if (res.code) {
        console.log('登陆成功')
        return await wx.cloud.callFunction({
          name: 'isManager'
        })
      } else {
        console.log('登陆失败')
      }
    })
    this.setData({
      // isManager: result
      isManager: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})