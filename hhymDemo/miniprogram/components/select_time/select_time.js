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
    total: 2, //总共天数
    start_time_text: '08月29日', //开始时间格式化文字
    start_text: '明天入住', //提示今天、明天、后天、周几
    end_time_text: '08月30日', //结束时间格式化文字
    end_text: '后天离店',
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})