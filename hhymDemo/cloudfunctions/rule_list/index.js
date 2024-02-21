// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境
const db = cloud.database();
const rule = db.collection("price_rule");
const _ = db.command;

// 删除规则
async function delete_rule(condition) {
  let c = {};
  // 涉及时间条件 做一下特殊处理
  for (let key in condition) {
    switch (key) {
      case "start":
        c[key] = _.gte(condition[key]);
        break;
      case "end":
        c[key] = _.lte(condition[key]);
        break;
      default:
        c[key] = condition[key];
        break;
    }
  }
  return await rule
    .where(c)
    .remove()
    .then(
      (res) => ({ msg: "删除成功", code: 200 }),
      (err) => ({ msg: "删除失败", code: 400 })
    );
}
// 查询规则
async function get_rule(condition) {
  // 目前没计划根据条件检索 只有全查
  // 按照时间排序
  return await rule
    .orderBy("start", "asc")
    .get()
    .then(
      (res) => ({ msg: "查询规则成功", code: 200, data: res.data }),
      (err) => ({ msg: "查询规则失败", code: 400 })
    );
}
// 新增规则
async function add_rule(params) {
  let res1 = await get_rule();
  if (res1.code !== 200) {
    return res1;
  }
  // 有可能传入的不是所需字段
  let body = {};
  for (let key in params) {
    switch (key) {
      case "start":
      case "end":
      case "price1":
      case "price2":
        body[key] = params[key];
        break;
    }
  }
  if (Object.entries(body).length !== 4) {
    return { msg: `参数错误:${JSON.stringify(params)}`, code: 400 };
  }
  // 规则时间不能交叠
  // 开始和结束时间都不能在任一规则时间段内
  // 计算新增规则时间段内是否有其他规则
  for (let val of res1.data) {
    if (body.start >= val.end) {
      // 如果新增开始大于等于当前规则结束直接跳过
      continue;
    }
    // 此时新增开始在当前规则结束之前 只有两种可能要么在内要么在左侧
    if (body.start >= val.start) {
      //在内
      return { msg: "时间段重复", code: 400 };
    }
    // 在左侧 判断新增结束是否在当前规则内或者跨过任一规则
    if (body.end >= val.start) {
      // 只要大于当前规则开始 都属于交叠
      return { msg: "时间段重复", code: 400 };
    }
    // 到这已经不存在交叠 无需进行后续循环判断 跳出
    break;
  }
  return await rule.add({ data: body }).then(
    (res) => ({ msg: "添加规则成功", code: 200 }),
    (err) => ({ msg: "添加规则失败", code: 400 })
  );
}

// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params, condition } = event;
  switch (type) {
    case "get":
      return await get_rule(condition);
    case "del":
      return await delete_rule(condition);
    case "post":
      return await add_rule(params);
    default:
      return { msg: `参数错误:${JSON.stringify(event)}`, code: 400 };
  }
};
