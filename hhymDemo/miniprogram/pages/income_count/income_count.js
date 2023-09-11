// 引入echart
import * as echarts from "../../components/ec-canvas/echarts.js";

Page({
  data: {},
  onLoad(options) {
    this.channel = this.getOpenerEventChannel();
    this.channel.on("order_list", (data) => {});
  },
  onReady() {
    let dom = this.selectComponent("#echart");
    dom.init((canvas, width, height, dpr) => {
      this.echart = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: dpr,
      });
      let options = this.bar_options()
      this.echart.setOption(options);
      return this.echart
    });
  },
  onUnload() {
    this.channel.emit("message", {
      msg: "customer",
    });
  },
  // echart配置
  bar_options() {
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
  },
});
