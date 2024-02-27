// 引入echart
import * as echarts from "../../components/ec-canvas/echarts.js";

Page({
  data: {
    // 时间轴选项
    time_options: [
      { label: "按年统计", value: "year" },
      { label: "按月统计", value: "month" },
    ],
    // 根据时间轴选项 切换不同可选值
    time_line: 1, //默认按月统计
    time_select: "", // 选的时间 不同时间轴下不同 因此要切换时清空
  },
  // 页面加载时 查询统计订单收入
  onLoad(options) {
    this.app = getApp();
  },
  // 页面渲染完成时 获取dom元素挂载图表
  async onReady() {
    // 默认进来查询今年的每月收入
    let nd = new Date();
    this.setData({
      time_select: `${nd.getFullYear()}`,
    });
    // 统计 生成图表
    // 加await是为了等获取到数据再执行onReady
    await this.statistic("month", `${nd.getFullYear()}-1-1`);
    // 初始化图表
    let dom = this.selectComponent("#echart");
    dom.init((canvas, width, height, dpr) => {
      this.echart = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: dpr,
      });
      let options = this.bar_options();
      this.echart.setOption(options);
      return this.echart;
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
        data: ["收入"],
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
          data: this.y_label,
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
          data: this.x_value,
        },
      ],
    };
  },
  // 选择时间等
  async select_value(e) {
    let { tag } = e.currentTarget.dataset;
    let set = {
      [tag]: e.detail.value,
    };
    if (tag === "time_line") {
      // 切换时间轴时清空日期选择
      set.time_select = "";
    }
    this.setData(set);
    switch (true) {
      case tag === "time_line" && e.detail.value == 0:
        // 有一种特殊情况 选按年统计时直接进行查询
        let et = new Date();
        await this.statistic("year", "2023-8-1", `${et.getFullYear()}-12-1`);
        break;
      case tag === "time_select":
        let t = this.data.time_options;
        let t2 = this.data.time_line;
        // 根据不同时间轴 处理选的时间 进行查询
        switch (t[t2].value) {
          case "month":
            await this.statistic("month", `${e.detail.value}-1-1`);
            break;
        }
        break;
    }
    // 变更选项重新获取数据后 再更新图表数据
    this.echart.setOption({
      yAxis: [{ data: this.y_label }],
      series: [{ data: this.x_value }],
    });
  },
  // 查询收入统计
  async statistic(type, start, end) {
    wx.showLoading({
      title: "查询中...",
      mask: true,
    });
    let condition = { start };
    if (end) {
      condition.end = end
    }
    let { data: res } = await this.app.mycall("statistic_income", {
      type,
      condition,
    });
    wx.hideLoading();
    if (res) {
      this.y_label = []; // 生成Y轴标签
      this.x_value = []; // 生成X轴值
      for (let val of res) {
        this.y_label.push(val.date);
        this.x_value.push(val.income);
      }
    }
  },
});
