// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const price = db.collection("set_price");
// 云函数入口函数
exports.main = async (event, context) => {
  // 区分是修改还是查询、新增
  if (event.type === "put") {
    return await price
      .where({ _id: event._id })
      .update({
        data: {
          price1: event.price1,
          price2: event.price2,
          month_day: event.month_day,
          month_discount: event.month_discount,
          half_month_day: event.half_month_day,
          half_month_discount: event.half_month_discount,
        },
      })
      .then(
        (res) => {
          return { msg: "更新成功", code: 200 };
        },
        (err) => {
          return { msg: "设置失败", code: 400 };
        }
      );
  } else if (event.type === "post") {
    return await price
      .add({
        data: {
          price1: event.price1,
          price2: event.price2,
          month_day: event.month_day,
          month_discount: event.month_discount,
          half_month_day: event.half_month_day,
          half_month_discount: event.half_month_discount,
        },
      })
      .then(
        (res) => {
          return { msg: "保存成功", code: 200 };
        },
        (err) => {
          return { msg: "新增失败", code: 400 };
        }
      );
  } else {
    let { data } = await price.get();
    return { msg: "查询成功", code: 200, data: data[0] };
  }
};
