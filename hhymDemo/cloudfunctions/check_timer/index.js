// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const _ = db.command;

// 查询过期订单 并更新状态
async function check_orders(boundary) {
  await cloud
    .callFunction({
      name: "orders",
      data: {
        type: "put",
        condition: {
          // 结束时间小于当前时间的
          end: boundary,
          // 订单状态为 未确认的
          status: 0,
        },
        params: {
          status: 2,
        },
      },
    })
    .then(
      (res) => true,
      (err) => false
    );
}
// 查询规则列表 删除过期规则
async function check_rule_list(boundary) {
  await cloud
    .callFunction({
      name: "rule_list",
      data: {
        type: "del",
        condition: {
          end: boundary,
        },
      },
    })
    .then(
      (res) => true,
      (err) => false
    );
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 每次检查时以当前服务器时间为 结束时间
  let boundary = new Date().getTime();
  // 定时检查订单 并将 未确认 且 过期的订单状态改为2
  check_orders(boundary);
  // 定时检查价格规则列表 将过期规则 删除
  check_rule_list(boundary);
};
