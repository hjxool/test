// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const user = db.collection("customers");
// 指令
const _ = db.command;

// 查询用户
async function get_user(params) {
  let condition = {};
  // 根据用户名查询
  if (params.name) {
    condition.name = params.name;
  }
  // 根据电话检索
  if (params.phone) {
    condition.phone = params.phone;
  }
  // 根据微信号检索
  if (params.weChat) {
    condition.weChat = params.weChat;
  }
  // 根据订单号反查用户
  if (params.order_id) {
    condition.orders = params.order_id;
  }
  // 根据宠物名反查用户
  if (params.pet_name) {
    condition["pet.name"] = params.pet_name;
  }
  // 如果参数为空 则查询当前操作用户信息
  if (!params) {
    // 获取用户id
    const { OPENID: user_id } = cloud.getWXContext();
    condition._id = user_id
  }
  let res = await user
    .where(condition)
    .get()
    .then(
      (res) => res.data,
      (err) => false
    );
  if (res) {
    return { msg: "查询用户成功", code: 200, data: res };
  } else {
    return { msg: "查询用户失败", code: 400 };
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params } = event;
  switch (type) {
    case "get":
      return await get_user(params);
    case "post":
      return await add_user(params);
    case "put":
      return await update_user(params);
    case "del":
      return await del_user(params);
    default:
      return { msg: `参数错误:${event}`, code: 400 };
  }
};
