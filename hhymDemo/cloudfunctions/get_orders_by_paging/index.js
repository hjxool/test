// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境
const db = cloud.database();
const order = db.collection("orders");
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  // 筛选条件和分页不是一个方法 还是分开接收
  let { condition, page_num, page_size } = event;
  let c = {};
  for (let key in condition) {
    switch (key) {
      case "customer_id":
      case "status":
        c[key] = condition[key];
        break;
      case "start":
        c.end = _.gt(new Date(condition.start).getTime());
        break;
      case "end":
        c.start = _.lt(new Date(condition.end).getTime());
        break;
    }
  }
  let d = await order.where(c);
  let { total } = await d.count();
  return await d
    .skip((page_num - 1) * page_size)
    .limit(page_size)
    .get()
    .then(
      (res) => ({
        msg: "分页查询订单成功",
        code: 200,
        data: {
          total,
          data: res.data,
        },
      }),
      (err) => ({ msg: "分页查询订单失败", code: 400 })
    );
};
