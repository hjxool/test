// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const order = db.collection("customers");

// 获取订单信息
async function get_list(params) {
  let condition = {}
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params } = event;
  switch (type) {
    case 'get':
     return await get_list(params)
    default:
      return { msg: `参数错误:${event}`, code: 400 };
  }
};
