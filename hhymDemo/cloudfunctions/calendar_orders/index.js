// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境
const db = cloud.database();
const order = db.collection("orders");
// 指令
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  // 日历查询略有特殊 查的是订单开始时间大于等于传入时间的已确认订单
  let t = new Date(`${event.start} 00:00:00`).getTime();
  let res = await order
    .where({
      start: _.gte(t),
      status: 1,
    })
    .orderBy("start", "asc")
    .get()
    .then((res) => res.data)
    .catch((err) => false);
  if (res) {
    return { msg: "查询日历订单成功", code: 200, data: res };
  } else {
    return { msg: "查询日历订单失败", code: 400 };
  }
};
