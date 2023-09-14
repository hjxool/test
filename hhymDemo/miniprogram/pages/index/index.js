Page({
  data: {
    isManager: 2, // 0管理员 1普通用户 2加载时不显示
  },
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
})