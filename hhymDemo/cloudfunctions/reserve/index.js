// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
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
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户id
  const { OPENID: user_id } = cloud.getWXContext();
  // 同步执行 因为创建订单所需的数据是全的 同时又有用户id
  // 等订单创建好后再拿用户id去创建或更新用户信息 这样就不需要创建好用户后再查找修改
  let res1 = await myCall(
    "orders",
    {
      type: "post",
      params: {
        cost: event.cost,
        customer_id: user_id,
        //注 收到的时间是年月日字符串 存在数据库里的是时间戳
        start: event.start,
        end: event.end,
        pet_name: event.pet.map((e) => e.name),
        room: event.room,
        status: 0, //-1拒绝 0待处理 1确认
      },
    },
    "创建订单失败"
  );
  // 创建订单失败直接返回错误信息
  if (res1.code !== 200) {
    return res1;
  }
  return await myCall("customer", {
    type: event.type,
    params: {
      _id: user_id,
      order_id: res1.data._id,
      name: event.name,
      phone: event.phone,
      weChat: event.weChat,
      pets: event.pet,
      know_from: event.know_from,
    },
  });
};
