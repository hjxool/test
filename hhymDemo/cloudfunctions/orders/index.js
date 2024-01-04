// 云函数入口文件
const { json } = require("body-parser");
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const order = db.collection("orders");
// 指令
const _ = db.command;

// 通用调接口方法
async function myCall(name, data) {
  let body = { name };
  if (data) {
    body.data = data;
  }
  let res = await cloud.callFunction(body).catch((err) => {
    return { msg: "err", code: 400 };
  });
  return res.result || res;
}
// 计算用户下总支出 并更新用户信息
async function update_user_pay(customer_id) {
  let res = await myCall("customer_pay", {
    customer_id: customer_id,
  });
  if (res.code !== 200) {
    // 统计失败不更新用户信息
    return res;
  }
  return await myCall("customer", {
    type: "put",
    condition: {
      _id: customer_id,
    },
    params: {
      pay: res.data,
    },
  });
}

// 获取订单信息 -1取消订单 0待确认 1确认订单 2过期
async function get_orders(condition) {
  let c = {};
  // 根据用户id查询订单
  if (condition?.customer_id) {
    c.customer_id = condition.customer_id;
  }
  // 根据时间查询
  // 接收到的参数应当是日期字符串 所以要处理成时间戳与数据库中进行判定
  if (condition?.start) {
    let start = new Date(condition.start).getTime();
    c.start = _.gte(start);
  }
  if (condition?.end) {
    let end = new Date(condition.end).getTime();
    c.end = _.lte(end);
  }
  // 根据订单状态查询订单
  // 订单状态是数字 0也会判断为空
  if (typeof condition?.status !== "undefined") {
    c.status = condition.status;
  }
  // 如果参数为空 则查询当前操作用户信息
  if (!condition) {
    // 获取用户id
    const { OPENID: user_id } = cloud.getWXContext();
    c.customer_id = user_id;
  }
  let res = await order
    .where(c)
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
    // 新增订单状态为确认才重新统计
    if (params.status === 1) {
      return await update_user_pay(params.customer_id);
    }
    return { msg: "success", code: 200 };
  } else {
    return { msg: "添加失败", code: 400 };
  }
}
// 更新订单
async function update_orders(params, condition) {
  // 更新订单可能涉及更新用户支出因此必须要传用户id
  // 虽然也可以在更新前 查询保存下用户id但是这样也要多操作数据库 没必要
  // 前端就能获取到订单记录中的用户id 传过来就是
  // if (!params._id || !params.customer_id) {
  //   return { msg: "id缺失", code: 400 };
  // }
  let status_change = false;
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
      case "status":
        // 这里要做区分 如果更新了订单状态 则要更新用户信息中的支出属性
        body[key] = params[key];
        if (params[key] == 1) {
          // 只有更改为确认 才统计
          status_change = true;
        }
        break;
      default:
        body[key] = params[key];
        break;
    }
  }
  // 到这一步已经过滤掉_id和customer_id 校验更新参数是否为空
  if (!Object.entries(body).length) {
    return { msg: "更新参数不能为空", code: 400 };
  }
  // 因为涉及时间 不能直接照搬传参
  let c = {};
  for (let key in condition) {
    switch (key) {
      case "start":
        let start = new Date(condition.start).getTime();
        c.start = _.gte(start);
        break;
      case "end":
        let end = new Date(condition.end).getTime();
        c.end = _.lte(end);
        break;
      default:
        c[key] = condition[key];
        break;
    }
  }
  let res = await order
    .where(c)
    .update({
      data: body,
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    // 如果更新了订单状态则要重新统计所操作用户支出
    if (status_change && condition.customer_id) {
      return await update_user_pay(condition.customer_id);
    }
    return { msg: "success", code: 200 };
  } else {
    return { msg: "更新失败", code: 400 };
  }
}
// 删除订单
async function del_orders(condition) {
  // 删除订单时必须传 用户id 可选传 订单id
  // 订单id必须是列表
  let c = {};
  for (let key in condition) {
    switch (key) {
      case "_id":
        if (!condition[key].length) {
          return { msg: "订单id必须传列表", code: 400 };
        }
        c[key] = _.in(condition[key]);
        break;
      case "customer_id":
        c[key] = condition[key];
        break;
    }
  }
  if (!Object.entries(c).length) {
    return { msg: "id缺失", code: 400 };
  }
  let res = await order
    .where(c)
    .remove()
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    // 删除用户所有订单时不用统计 删除一个或多个订单时要重新统计
    if (c._id && c.customer_id) {
      // 有订单id说明不是全删
      return await update_user_pay(c.customer_id);
    }
    return { msg: "success", code: 200 };
  } else {
    return { msg: "删除失败", code: 400 };
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params, condition } = event;
  switch (type) {
    case "get":
      return await get_orders(condition);
    case "post":
      return await add_orders(params);
    case "put":
      return await update_orders(params, condition);
    case "del":
      return await del_orders(condition);
    default:
      return { msg: `参数错误:${JSON.stringify(event)}`, code: 400 };
  }
};
