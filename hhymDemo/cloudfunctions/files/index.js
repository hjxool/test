// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const { storage } = new CloudBase({ envId: "cloud1-0gzy726e39ba4d96" });

// 获取文件列表
async function get_files(params) {
  let {path} = params
  let res = await storage.listDirectoryFiles(path)
  return {msg:'success',code:200, data:res}
}

// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params } = event;
  switch (type) {
    case "get":
      return get_files(params)
  }
};
