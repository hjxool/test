// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
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

// 云函数入口函数
exports.main = async (event, context) => {
  // 不需要连数据库 调其他库相关接口根据查回来的结果进行统计
  // 统计根据参数分为年、月、日、周统计
  // 年月周等统计是根据前端传的日期计算
  // 以及针对用户统计
  // 只统计订单确认成交的
  let condition = {
    status: 1,
  };
  for (let key in event) {
    switch (key) {
      case "customer_id":
      case "start":
      case "end":
        condition[key] = event[key];
        break;
    }
  }
  if (Object.entries(condition).length === 1) {
    return { msg: "参数错误", code: 400 };
  }
  let res = await myCall("orders", {
    type: "get",
    params: condition,
  });
  if (res.code !== 200) {
    return res;
  }
  // 统计请求回来的数据
  let total = res.data.reduce((pre, cur) => pre + cur.cost, 0);
  return { msg: "success", code: 200, data: total };
};
