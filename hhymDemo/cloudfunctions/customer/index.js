// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境
const db = cloud.database();
const user = db.collection("customers");
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

// 查询用户
async function get_user(condition) {
  let c = {};
  // 根据用户名 模糊查询
  if (condition?.name) {
    c.name = db.RegExp({
      regexp: `${condition.name}`,
      options: "i",
    });
  }
  // 根据电话检索
  if (condition?.phone) {
    c.phone = condition.phone;
  }
  // 根据宠物名反查用户
  if (condition?.pet_name) {
    c["pet.name"] = condition.pet_name;
  }
  // 根据用户id查询
  if (condition?.user_id) {
    c._id = condition.user_id
  }
  // 如果参数为空 则查询当前操作用户信息
  if (!condition) {
    // 获取用户id
    const { OPENID: user_id } = cloud.getWXContext();
    c._id = user_id;
  }
  let res = await user
    .where(c)
    .get()
    .then(
      (res) => res.data,
      (err) => false
    );
  if (res) {
    return { msg: "查询用户成功", code: 200, data: res };
  } else {
    return { msg: "查询用户失败", code: 400 };
  }
}
// 新增用户
// 新增和更新只能选单个
async function add_user(params) {
  let body = {};
  for (let key in params) {
    switch (key) {
      case "_id":
      case "name":
      case "phone":
      case "pets":
      case "know_from":
      case "pay":
      case "orders":
      case "remark":
        body[key] = params[key];
        break;
    }
  }
  if (Object.entries(body).length !== 8) {
    return { msg: "新增用户参数错误", code: 400 };
  }
  // 新增重复的_id会自动报错不需要查了再添加
  let res = await user
    .add({
      data: body,
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    return { msg: "success", code: 200 };
  } else {
    return { msg: "添加用户失败", code: 400 };
  }
}
// 更新用户
// 更新用户不涉及订单 因此传什么字段就存什么
async function update_user(params, condition) {
  if (!condition._id) {
    return { msg: "_id缺失", code: 400 };
  }
  // 用户名是否修改
  let name_change = false;
  // 更新时字段不固定
  let body = {};
  for (let key in params) {
    switch (key) {
      case "pets":
        // 整个pets列表进行替换
        body.pets = _.set(params.pets);
        break;
      case "_id":
        // _id 不能修改
        continue;
      default:
        // 用户预约时 可能会修改用户名 而订单中记录了用户名 因此要同步修改
        if (key === "name") {
          name_change = true;
        }
        body[key] = params[key];
        break;
    }
  }
  if (!Object.entries(body).length) {
    return { msg: "更新参数不能为空", code: 400 };
  }
  let res = await user
    .doc(condition._id)
    .update({
      data: body,
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    // 修改用户相关订单下用户名字段
    if (name_change) {
      await myCall("orders", {
        type: "put",
        condition: {
          customer_id: condition._id,
        },
        params: {
          customer_name: body.name,
        },
      });
    }
    return { msg: "更新用户成功", code: 200 };
  } else {
    return { msg: "更新用户失败", code: 400 };
  }
}
// 删除用户
// 删除时可以多个
async function del_user(condition) {
  if (!condition?._id) {
    // 删除时必须传id列表
    return { msg: "_id缺失", code: 400 };
  }
  let res = await user
    .where({
      _id: condition._id,
    })
    .remove()
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    // 删除成功也要将用户相关的订单一并删除
    return await myCall("orders", {
      type: "del",
      condition: {
        customer_id: condition._id,
      },
    });
  } else {
    return { msg: "删除用户失败", code: 400 };
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params, condition } = event;
  switch (type) {
    case "get":
      return await get_user(condition);
    // 新增和更新改为支持事务的形式
    case "post":
      return await add_user(params);
    case "put":
      return await update_user(params, condition);
    case "del":
      return await del_user(condition);
    default:
      return { msg: `参数错误:${JSON.stringify(event)}`, code: 400 };
  }
};
