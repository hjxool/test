// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const file = db.collection("file_path");

// 获取数据库中存的文件信息
async function get_files(params) {
  // 查询时根据文件路径区分
  let condition = { cloud_path: params.cloud_path };
  // 如果没有文件名(唯一值)则全查
  if (params.file_name) {
    condition.file_name = params.file_name;
  }
  let res = await file
    .where(condition)
    .get()
    .then((res) => res.data);
  return { msg: "success", code: 200, data: res };
}
// 新增文件信息 上传一条添加一条 所以只会有一条
async function add_files(params) {
  // 校验是否有重名的 如果重名则更新对应记录 否则添加新的记录
  let data = await file
    .where({ cloud_path: params.cloud_path })
    .get()
    .then((res) => res.data);
  let flag = false;
  for (let val of data) {
    if (val.file_name === params.file_name) {
      flag = true;
      break;
    }
  }
  if (flag) {
    let res = await file
      .where({ cloud_path: params.cloud_path, file_name: params.file_name })
      .update({
        data: {
          file_path: params.file_path,
        },
      })
      .then(
        (res) => true,
        (err) => false
      );
    if (res) {
      return { msg: "success", code: 200 };
    } else {
      return { msg: "更新失败", code: 400 };
    }
  } else {
    let res = await file
      .add({
        data: {
          cloud_path: params.cloud_path,
          file_name: params.file_name,
          file_path: params.file_path,
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
}
// 更新对应的文件信息
async function update_files(params) {
  let res = await file
    .where({ cloud_path: params.cloud_path, file_name: params.file_name })
    .update({
      data: {
        file_path: params.file_path,
      },
    })
    .then(
      (res) => true,
      (err) => false
    );
  if (res) {
    return { msg: "success", code: 200 };
  } else {
    return { msg: "更新失败", code: 400 };
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  let { type, params } = event;
  switch (type) {
    case "get":
      return await get_files(params);
    case "post":
      return await add_files(params);
    case "put":
      return await update_files(params);
    default:
      return { msg: `参数错误:${event}`, code: 400 };
  }
};
