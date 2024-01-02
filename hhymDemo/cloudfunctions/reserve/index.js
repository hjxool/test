// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
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
  if (Object.entries(params).length !== 7) {
    return { msg: "参数缺失", code: 400 };
  }
  let res = await transaction
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

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户id
  const { OPENID: user_id } = cloud.getWXContext();
  // 校验字符
  let { type, params } = event;
  if (!params.start || !params.end || !params.room) {
    return { msg: `参数错误:${JSON.stringify(event)}`, code: 400 };
  }
  // 开启事务 主要是为了处理订单新增成功 但后续操作失败时留下无效订单
  // 所以像查的操作不需要用事务对象
  // try catch也不是必须的 官方示例中是因为没有用catch等捕获单个操作的异常
  // 我的接口中除了集合操作异常 还有参数不符合条件手动返回的失败结果 因此不适用try catch
  const transaction = await db.startTransaction();
  // 同步执行 因为创建订单所需的数据是全的 同时又有用户id
  // 等订单创建好后再拿用户id去创建或更新用户信息 这样就不需要创建好用户后再查找修改
  let res1 = await add_orders(
    {
      cost: params.cost,
      customer_id: user_id,
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
  // 创建好订单后 统计用户所有确认订单总额再传给用户接口
  let res2 = await myCall("customer_pay", {
    customer_id: user_id,
  });
  // 统计用户订单金额失败也要回滚
  if (res2.code !== 200) {
    // 回滚并传回失败结果
    await transaction.rollback(res2);
    return res2;
  }
  // 创建或更新用户信息时 不需要用事务对象 因为操作失败也不会写入进去数据
  let body = {
    type,
    params: {
      name: params.name,
      phone: params.phone,
      weChat: params.weChat,
      pets: params.pet,
      know_from: params.know_from,
      pay: res2.data,
    },
  };
  if (type === "post") {
    body.params._id = user_id;
  } else if (type === "put") {
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
