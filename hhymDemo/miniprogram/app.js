App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "cloud1-0gzy726e39ba4d96",
        traceUser: true,
      });
    }
    this.globalData = {
      pop_content: "", //弹窗展示内容
      start_time: 0, //入住开始时间戳
      end_time: 0, //入住结束时间戳
      // rooms: [], //房间总列表
    };
    // init_room(this.globalData.rooms);
  },
  // 通用请求方法
  async mycall(name, data) {
    console.log("我看看传入的是什么勾八", data);
    let body = { name, data: {} };
    // 如果有传参
    if (data) {
      body.data = data;
    }
    let { result } = await wx.cloud.callFunction(body);
    console.log("返回的是什么垃圾", result);
    // 如果返回结果失败 通知失败结果 成功则让前端决定如何做
    if (result.code !== 200) {
      wx.showToast({
        title: result.msg,
        icon: "none",
      });
      setTimeout(() => {
        wx.hideToast();
      }, 1000);
      return false;
    } else {
      return result;
    }
  },
});
//#region
// 生成房间总列表
// function init_room(list) {
//   for (let index = 1; index <= 13; index++) {
//     if (index <= 11) {
//       let t = {
//         label: `标准间${index}`,
//         check: false,
//       };
//       list.push(t);
//     } else {
//       let i = index - 11;
//       let t = {
//         label: `豪华间${i}`,
//         check: false,
//       };
//       list.push(t);
//     }
//   }
// }
//#endregion
