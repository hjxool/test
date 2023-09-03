// 引入echart
import * as echarts from "../ec-canvas/echarts.js";
let chart = null;
// echart配置
function bar_options() {
  return {
    // 提示框
    tooltip: {
      trigger: "axis", //坐标轴触发
      // 坐标轴指示器，坐标轴触发有效
      axisPointer: {
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true, //是否将 tooltip 框限制在图表的区域内
    },
    // 图例
    legend: {
      data: ["收入", "支出"],
    },
    // 网格
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true, //是否把坐标轴算作网格区域
    },
    // X轴
    xAxis: [
      {
        type: "value",
        //坐标轴刻度
        axisLabel: {
          color: "#666",
        },
      },
    ],
    yAxis: [
      {
        type: "category",
        axisTick: { show: false }, // Y轴刻度
        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
        // axisLine: {
        //   lineStyle: {
        //     color: "#999",
        //   },
        // },
        axisLabel: {
          color: "#666",
        },
      },
    ],
    series: [
      {
        name: "收入",
        type: "bar",
        // 图形上的文字标签
        label: {
          normal: {
            show: true, //是否在柱体上显示文字
            // position: "inside", //在柱体内
          },
        },
        data: [300, 270, 340, 344, 300, 320, 310],
      },
      {
        name: "支出",
        type: "bar",
        stack: "总量",
        label: {
          normal: {
            show: true,
          },
        },
        data: [120, 102, 141, 174, 190, 250, 220],
      },
    ],
  };
}
// 初始化echart方法
function init_echart(canvas, width, height, dpr) {
  // 保存echart对象
  chart = echarts.init(canvas, null, {
    width,
    height,
    devicePixelRatio: dpr,
  });
  canvas.setChart(chart);
  let options = bar_options();
  chart.setOption(options);
  return chart;
}
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    modules: [
      { title: "客户列表", icon: "icon-kehu", page: "" },
      { title: "订单列表", icon: "icon-quanbudingdan", page: "" },
      { title: "计价规则", icon: "icon-guize", page: "" },
      { title: "单价设置", icon: "icon-tixianguize", page: "" },
    ],
    echart_title: "",
    titles: [
      { title: "月度收入", options: {} },
      { title: "年收入", options: {} },
    ],
    echarts_select_show: false,
    ec: {
      onInit: init_echart,
    },
  },
  lifetimes: {
    // 组件实例进入节点树时执行
    attached() {
      this.setData({
        echart_title: this.data.titles[0].title,
      });
    },
    //#region
    // 组件布局完成后执行
    // ready() {
    //   this.init_echart();
    // },
    //#endregion
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 显示可选图表
    show_titles() {
      this.setData({
        echarts_select_show: !this.data.echarts_select_show,
      });
    },
    // 切换图表
    change_echart(e) {
      let title = e.currentTarget.dataset.title;
      this.setData({
        echart_title: title,
        echarts_select_show: false,
      });
    },
    // 关闭弹窗
    close_pop() {
      this.setData({
        echarts_select_show: false,
      });
    },
    // 跳转对应页面
    turn_to_page(e) {
      let page = e.currentTarget.dataset.page
      wx.navigateTo({
        url: '/pages/calendar/calendar',
      })
    },
  },
});
