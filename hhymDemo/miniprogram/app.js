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
    let res = await wx.cloud.callFunction(body).catch((err) => "err");
    console.log("返回的是什么垃圾", res.result);
    // 如果返回结果失败 通知失败结果 成功则让前端决定如何做
    if (res === "err" || res.result.code !== 200) {
      wx.showToast({
        title: res.result?.msg || "error",
        icon: "none",
      });
      setTimeout(() => {
        wx.hideToast();
      }, 1000);
      return false;
    } else {
      return res.result;
    }
  },
  // 封装的批量上传方法 不能用随机生成的本地文件名 用同名可以直接替换
  async upload(file_list, cloud_path, type) {
    wx.showLoading({
      title: "上传中...",
      mask: true,
    });
    let task = []; //存储异步上传任务
    for (let val of file_list) {
      let p = wx.cloud
        .uploadFile({
          cloudPath: `${cloud_path}/${val.file_name}`,
          filePath: val.tempFilePath,
        })
        .then((res) => {
          // 上传成功就存
          this.mycall("files", {
            type,
            params: {
              file_name: val.file_name, //文件名 唯一标识 用于新增和更新云存储
              file_path: res.fileID, //文件引用路径
              cloud_path, //放在哪个文件夹
            },
          });
        })
        .catch((err) => {
          return "err";
        });
      task.push(p);
    }
    let res = await Promise.all(task).catch((err) => "err");
    // 无论成功与否都关闭遮罩
    setTimeout(() => {
      wx.hideLoading();
    }, 300);
    if (res !== "err") {
      // 全部上传成功 给个提示
      wx.showToast({
        title: "上传成功",
      });
      setTimeout(() => {
        wx.hideToast();
      }, 1000);
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
