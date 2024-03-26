// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境
const db = cloud.database();
// 通用调接口方法
async function myCall(name, data) {
  let body = { name };
  if (data) {
    body.data = data;
  }
  let res = await cloud.callFunction(body).catch((err) => {
    return { msg: err, code: 400 };
  });
  return res.result || res;
}
// 添加订单
async function add_orders(params, transaction) {
  if (Object.entries(params).length !== 8) {
    return { msg: "参数不对", code: 400 };
  }
  let res = await transaction
    .add({
      data: {
        cost: params.cost,
        customer_id: params.customer_id,
        customer_name: params.customer_name,
        start: new Date(`${params.start} 00:00:00`).getTime(),
        end: new Date(`${params.end} 00:00:00`).getTime(),
        pet_name: params.pet_name,
        room: params.room,
        status: params.status,
      },
    })
    .then(
      (res) => true,
      (err) => {
        console.log(err);
        return false;
      }
    );
  if (res) {
    return { msg: "success", code: 200 };
  } else {
    return { msg: "添加失败", code: 400 };
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户id
  const { OPENID: user_id } = cloud.getWXContext();
  // 校验字符
  let { type, params } = event;
  if (!params.start || !params.end || !params.room) {
    return { msg: `参数错误:${JSON.stringify(event)}`, code: 400 };
  }
  // 需要事务 在更新用户信息失败后回滚
  const transaction = await db.startTransaction();
  // 同步执行 因为创建订单所需的数据是全的 同时又有用户id
  // 等订单创建好后再拿用户id去创建或更新用户信息 这样就不需要创建好用户后再查找修改
  let res1 = await add_orders(
    {
      cost: params.cost,
      customer_id: user_id,
      customer_name: params.name, // 存一下用户名 因为管理员查看时需要
      //注 收到的时间是年月日字符串 存在数据库里的是时间戳
      start: params.start,
      end: params.end,
      pet_name: params.pet.map((e) => e.name),
      room: params.room,
      status: 0, //-1拒绝 0待处理 1确认 2过期
    },
    transaction.collection("orders")
  );
  // 创建订单失败直接返回错误信息
  if (res1.code !== 200) {
    return res1;
  }
  // 创建或更新用户信息时 不需要用事务对象 因为操作失败也不会写入进去数据
  let body = {
    type,
    params: {
      name: params.name,
      phone: params.phone,
      pets: params.pet,
      know_from: params.know_from,
    },
  };
  if (type === "post") {
    // 新增用户要传入用户id
    body.params._id = user_id;
    // 新建用户的金额和成交订单数都为0
    body.params.pay = 0;
    body.params.orders = 0;
  } else if (type === "put") {
    // 更新用户信息要根据用户id检索
    // 已存在用户预约的新订单不计入金额统计所以不更新这项
    body.condition = { _id: user_id };
  }
  let res3 = await myCall("customer", body);
  // 操作用户失败回滚 删除新增订单
  if (res3.code !== 200) {
    await transaction.rollback(res3);
    return res3;
  }
  // 所有步骤都成功后提交事务 从而真正的修改数据
  await transaction.commit();
  return res3;
};
