// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const user = db.collection("customers");
// 指令
const _ = db.command;

// 通用调接口方法
async function myCall(name, data, err = "error") {
  let body = { name };
  if (data) {
    body.data = data;
  }
  let res = await cloud.callFunction(body).catch((err) => "err");
  if (res === "err" || res?.result.code !== 200) {
    return { msg: err, code: 400 };
  } else {
    return { msg: "success", code: 200, data: res.result };
  }
}

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
    condition._id = user_id;
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
// 新增用户
async function add_user(params) {
  // 新增重复的_id会自动报错不需要查了再添加
  let res = await user
    .add({
      data: {
        _id: params._id,
        orders: _.push(params.order_id),
        name: params.name,
        phone: params.phone,
        weChat: params.weChat,
        pets: params.pets,
        know_from: params.know_from,
        pay: 0, //新增用户初始花费为0
      },
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    return { msg: "success", code: 200 };
  } else {
    return { msg: "添加用户失败", code: 400 };
  }
}
// 更新用户
async function update_user(params) {
  if (!params._id) {
    return { msg: "_id缺失", code: 400 };
  }
  // 用户订单变更时 统计新用户订单总花费
  let order_change = false;
  // 更新时字段不固定
  let body = {};
  for (let key in params) {
    switch (key) {
      case "order_id":
        // 有可能需要删除订单 因此要做区分
        // order_id可以是数组或字符串 表示增删一个或多个订单
        if (params.order_type === "del") {
          body.orders = _.pullAll(params.order_id);
        } else {
          body.orders = _.push(params.order_id);
        }
        order_change = true;
        break;
      case "pets":
        // 整个pets列表进行替换
        body.pets = _.set(params.pets);
        break;
      case "_id":
        // _id 不能修改
        continue;
      default:
        body[key] = params[key];
        break;
    }
  }
  if (!Object.entries(body).length) {
    return { msg: "更新参数不能为空", code: 400 };
  }
  if (order_change) {
    let res = await myCall(
      "customer_pay",
      {
        // 统计当前操作的用户订单
        customer_id: params._id,
      },
      "统计用户支出失败"
    )
    if (res.code!==200) {
      // 统计失败不更新用户信息
      return res
    }
    body.pay = res.data
  }
  let res = await user
    .where({
      _id: params._id,
    })
    .update({
      data: body,
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    return { msg: "success", code: 200 };
  } else {
    return { msg: "更新用户失败", code: 400 };
  }
}
// 删除用户
async function del_user(params) {}
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
