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
  properties: {},
  data: {
    modules: [
      { title: "客户列表", icon: "icon-kehu", page: "customer" },
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
    echart_show: true, //图表显示
    confirm_num: 0, //待确认订单数
  },
  lifetimes: {
    // 组件实例进入节点树时执行
    attached() {
      let st = new Date("2023/7/1");
      let et = new Date("2023/7/7");
      this.list = [];
      for (let index = 0; index < 10; index++) {
        let t = {
          name: "张三",
          start_time: st.getTime(),
          end_time: et.getTime(),
          room: ["A01", "A02"],
        };
        this.list.push(t);
      }
      this.setData({
        echart_title: this.data.titles[0].title,
        confirm_num: this.list.length,
      });
    },
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
      let page = e.currentTarget.dataset.page;
      let fn2 = (data) => {
        // 刷新数据的时机 一是从其他页面返回时 二是扫码进入小程序时
        this.get_data();
        chart.setOption({
          series: [
            {
              data: [120, 102, 141, 174, 190, 250, 220],
            },
            { data: [300, 270, 340, 344, 300, 320, 310] },
          ],
        });
        setTimeout(() => {
          this.setData({
            echart_show: true,
          });
        }, 200);
      };
      // 跳转不同页面触发不同事件
      // 跳转页只负责把获取的所有数据对应传入页面
      let fn;
      switch (page) {
        case "confirm":
          fn = (res) => {
            res.eventChannel.emit("comfirm_list", this.list);
          };
          break;
        case "calendar":
        case "customer":
          fn = (res) => {
            let list = [];
            for (let index = 0; index < 3; index++) {
              let t = {
                name: "xxx1",
                phone: "13356569874",
                weChat: "yyuujj",
                pet_name: "asdad",
                pet_detail: "asdasdasd2222",
                orders: [1, 2, 3, 4],
                pay: "750",
              };
              list.push(t);
            }
            res.eventChannel.emit("customer_list", list);
          };
          break;
      }
      wx.navigateTo({
        url: `/pages/${page}/${page}`,
        events: {
          message: fn2,
        },
        success: fn,
      });
      this.setData({
        echart_show: false,
      });
    },
    // 刷新页面数据
    get_data() {
      console.log("refresh");
    },
  },
});
