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
    place_name: '好好养猫纯猫寄养酒店',
    address: '武侯区666路'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转地图页面
    turn_to_map() {
      wx.openLocation({
        latitude: 30.54716, // 纬度
        longitude: 104.03735, // 经度
        name: '成都市', // 地点名称
        address: '好好养猫纯猫寄养酒店', // 地址的详细说明
        scale: 20, // 缩放比例
      }).then(res=>{
        console.log('打开地图成功');
      }).catch(err=>{
        console.log('打开地图失败', err);
      })
    },
    // 显示电话
    show_phone(){
      let app = getApp()
      app.globalData.pop_content = 'phone'
      this.triggerEvent('popevent','open pop')
    }
  }
})