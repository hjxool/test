// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const _ = db.command;

// 查询过期订单 并更新状态
async function check_orders(bounday) {
  let { data: res } = await cloud.callFunction({
    name: "orders",
    data: {
      type: "get",
      condition: {
        // 结束时间小于当前时间的
        end: bounday,
        // 订单状态为 未确认的
        status: 0,
      },
    },
  });
  if (!res) {
    throw "查询订单失败";
  }
  for(let val of res){

  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 每次检查时以当前服务器时间为 结束时间
  let bounday = new Date().getTime();
  // 定时检查订单 并将 未确认 且 过期的订单状态改为2

  // 定时检查价格规则列表 将过期规则 删除
};
