// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const order = db.collection("orders");
// 指令
const _ = db.command;

// 获取订单信息
async function get_orders(params) {
  let condition = {};
  // 根据用户id查询订单
  if (params.customer_id) {
    condition.customer_id = params.customer_id;
  }
  // 查询时间段内订单
  if (params.start && params.end) {
    // 接收到的参数应当是日期字符串 所以要处理成时间戳与数据库中进行判定
    let start = new Date(params.start).getTime();
    let end = new Date(params.end).getTime();
    condition.start = _.gte(start);
    condition.end = _.lte(end);
  }
  // 根据订单状态查询订单
  if (params.status) {
    condition.status = params.status;
  }
  let res = await order
    .where(condition)
    .get()
    .then((res) => res.data)
    .catch((err) => false);
  if (res) {
    return { msg: "查询订单成功", code: 200, data: res };
  } else {
    return { msg: "查询订单失败", code: 400 };
  }
}
// 添加订单
async function add_orders(params) {
  if (Object.entries(params).length !== 7) {
    return { msg: "参数缺失", code: 400 };
  }
  let res = await order
    .add({
      data: {
        cost: params.cost,
        customer_id: params.customer_id,
        start: new Date(params.start).getTime(),
        end: new Date(params.end).getTime(),
        pet_name: params.pet_name,
        room: params.room,
        status: params.status,
      },
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    return { msg: "success", code: 200 };
  } else {
    return { msg: "添加失败", code: 400 };
  }
}
// 更新订单
async function update_orders(params) {
  if (!params._id) {
    return { msg: "_id缺失", code: 400 };
  }
  // 更新时字段不固定
  let body = {};
  for (let key in params) {
    switch (key) {
      case "start":
      case "end":
        body[key] = new Date(params[key]).getTime();
        break;
      case "_id":
      case "customer_id":
        // _id 用户id 不能修改
        continue;
      default:
        // 这里要做区分 如果更新了订单状态 则要更新用户信息中的支出属性
        body[key] = params[key];
        break;
    }
  }
  // 到这一步已经过滤掉_id和customer_id 校验更新参数是否为空
  if (!Object.entries(body).length) {
    return { msg: "更新参数不能为空", code: 400 };
  }
  let res = await order
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
    return { msg: "更新失败", code: 400 };
  }
}
// 删除订单
async function del_orders(params) {
  if (!params._id) {
    return { msg: "_id缺失", code: 400 };
  }
  let res = await order
    .where({
      _id: params._id,
    })
    .remove()
    .then(
      (res) => true,
      (err) => false
    );
    if (res) {
      return { msg: "success", code: 200 };
    } else {
      return { msg: "删除失败", code: 400 };
    }
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params } = event;
  switch (type) {
    case "get":
      return await get_orders(params);
    case "post":
      return await add_orders(params);
    case "put":
      return await update_orders(params);
    case "del":
      return await del_orders(params);
    default:
      return { msg: `参数错误:${event}`, code: 400 };
  }
};
