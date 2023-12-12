// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.customer_id) {
    return { msg: "缺少用户id", code: 400 };
  }
  // 不需要连数据库 调其他库相关接口根据查回来的结果进行统计
  // 统计根据参数分为年、月、日、周统计
  // 以及针对用户统计
  // 只统计订单确认成交的
};
