// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const rule = db.collection("price_rule");
// 云函数入口函数
exports.main = async (event, context) => {
  // 区分删除还是新增
  if (event.type === "delete") {
    return await rule
      .where({ _id: event._id })
      .remove()
      .then(
        (res) => {
          return { msg: "success", code: 200 };
        },
        (err) => {
          return { msg: "删除失败", code: 400 };
        }
      );
  } else {
    let params = Object.entries(event);
    let result = await rule.get().then((res) => {
      return res.data;
    });
    // 参数为空则查询 否则新增
    if (params.length) {
      // 有可能传入的不是所需字段
      let count = 0;
      for (let val of params) {
        if (
          val[0] == "start" ||
          val[0] == "end" ||
          val[0] == "price" ||
          val[0] == "room"
        ) {
          count++;
        }
      }
      // 如果对应字段数量不匹配 则验证失败
      if (count !== 4) {
        return {
          msg: "传参错误:" + JSON.stringify(event),
          code: 200,
          data: result,
        };
      }
      // 新增前判断是否有重复
      for (let val of result) {
        if (val.start === event.start || val.end === event.end) {
          return { msg: "时间段重复", code: 400 };
        }
      }
      return await rule.add({ data: { ...event } }).then(
        (res) => {
          return { msg: "success", code: 200 };
        },
        (err) => {
          return { msg: "添加失败", code: 400 };
        }
      );
    } else {
      return { msg: "success", code: 200, data: result };
    }
  }
};
