// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境
const db = cloud.database();
const manager = db.collection("manager");
// 云函数入口函数
exports.main = async (event, context) => {
  // 查询数据库里是否有对应id
  let { OPENID } = cloud.getWXContext();
  let res2 = await manager.get().then((res) => {
    for (let val of res.data) {
      if (OPENID === val.openid) {
        return { type: 0, id: OPENID };
      }
    }
    return { type: 1, id: OPENID };
  });
  return res2;
};
