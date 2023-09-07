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
    // 查询结果要按照时间排序
    let result = await rule
      .orderBy("start", "asc")
      .get()
      .then((res) => {
        return res.data;
      });
    // 如果对应字段数量不匹配 则验证失败 新增
    // 有可能传入的不是所需字段
    let count = 0;
    for (let val of params) {
      if (
        val[0] == "start" ||
        val[0] == "end" ||
        val[0] == "price1" ||
        val[0] == "price2"
      ) {
        count++;
      }
    }
    if (count !== 4) {
      return { msg: "success", code: 200, data: result };
    } else {
      // 规则时间不能交叠
      // 开始和结束时间都不能在任一规则时间段内
      // 计算新增规则时间段内是否有其他规则
      for (let val of result) {
        if (event.start >= val.end) {
          // 如果新增开始大于等于当前规则结束直接跳过
          continue;
        }
        // 此时新增开始在当前规则结束之前 只有两种可能要么在内要么在左侧
        if (event.start >= val.start) {
          //在内
          return { msg: "时间段重复", code: 400 };
        }
        // 在左侧 判断新增结束是否在当前规则内或者跨过任一规则
        if (event.end >= val.start) {
          // 只要大于当前规则开始 都属于交叠
          return { msg: "时间段重复", code: 400 };
        }
        // 到这已经不存在交叠 无需进行后续循环判断 跳出
        break;
      }
      return await rule.add({ data: { ...event } }).then(
        (res) => {
          return { msg: "success", code: 200 };
        },
        (err) => {
          return { msg: "添加失败", code: 400 };
        }
      );
    }
  }
};
