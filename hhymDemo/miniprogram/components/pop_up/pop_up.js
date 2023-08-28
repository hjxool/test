Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    // 组件实例进入页面节点树时执行
    attached() {
      let app = getApp()
      this.setData({
        type: app.globalData.pop_content
      })
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    type: '', //展示什么内容
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    close_pop() {
      this.triggerEvent('popevent', 'close pop')
    }
  }
})