// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "cloud1-0gzy726e39ba4d96", traceUser: true }); // 使用当前云环境

// 一天的毫秒数
const one_day = 24 * 60 * 60 * 1000;

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

// 根据传入的日期列表 遍历订单统计每段日期内收入
function statistic(dates, orders) {
  for (let val of orders) {
    // 先计算当前订单平均每天金额
    let days = (val.end - val.start) / one_day;
    let average = Math.floor((val.cost / days) * 100) / 100;
    // 再遍历日期列表 进行累计
    for (let val2 of dates) {
      // 记录范围内有几天 最后再乘以均价得出累计金额
      let d;
      // 情况有两大类
      if (val.start >= val2.time.start && val.start < val2.time.end) {
        // 注意 不能等于日期结束时间 因为是下个月1号
        // 订单开始时间在日期范围内
        // 则判断结束时间是否在范围内 只有在或不在两种
        if (val.end <= val2.time.end) {
          d = Math.ceil((val.end - val.start) / one_day);
        } else {
          d = Math.ceil((val2.time.end - val.start) / one_day);
        }
      } else if (val.start < val2.time.end) {
        // 订单开始时间不在范围内 且小于范围结束日期
        // 则判断结束时间是否在范围内 只有在范围内和大于范围结束时间两种
        if (val.end > val2.time.start && val.end < val2.time.end) {
          d = Math.ceil((val.end - val2.time.start) / one_day);
        } else if (val.end >= val2.time.end) {
          d = Math.ceil((val2.time.end - val2.time.start) / one_day);
        }
      }
      if (d) {
        // 有的会丢失精度 以防万一在这取小数点后一位
        let c = Math.floor(d * average * 10) / 10;
        val2.income = Math.round(val2.income + c)
      }
    }
  }
  // 只提取出里面的标签和收入信息
  return dates.map(({ date, income }) => ({ date, income }));
}

// 统计各年收入
async function year(c) {
  let now = new Date(`${c.end} 00:00:00`);
  let now_y = Number(now.getFullYear());
  let res = await myCall("orders", {
    type: "get",
    condition: {
      start: c.start,
      end: `${now_y + 1}-1-1`, //因为是小于不等于 所以传1号就可以统计到上个月末
      status: 1, //只查已确认订单
    },
  });
  if (res.code !== 200) {
    return res;
  }
  // 返回值是降序排列 要反转一下
  res.data.reverse();
  // 构建要返回的数组结构
  let list = [];
  let start_y = Number(c.start.split("-")[0]);
  for (let i = 0; i <= now_y - start_y; i++) {
    let t = {
      date: `${start_y + i}`, // 分类标签
      // 判断条件
      time: {
        start: new Date(`${start_y + i}-1-1 00:00:00`).getTime(),
        end: new Date(`${start_y + i + 1}-1-1 00:00:00`).getTime(), // 这里是直接年份增加所以不会有问题
      },
      income: 0, // 收入
    };
    list.push(t);
  }
  return { msg: "统计成功", code: 200, data: statistic(list, res.data) };
}
// 统计一年中每个月收入
async function month(c) {
  // 以传入时间的年末为截止时间
  let now = new Date(`${c.start} 00:00:00`);
  let now_y = Number(now.getFullYear());
  let res = await myCall("orders", {
    type: "get",
    condition: {
      start: c.start,
      end: `${now_y + 1}-1-1`, //因为是小于不等于 所以传1号就可以统计到上个月末
      status: 1, //只查已确认订单
    },
  });
  if (res.code !== 200) {
    return res;
  }
  // 返回值是降序排列 要反转一下
  res.data.reverse();
  // 构建要返回的数组结构
  let list = [];
  let start_m = Number(c.start.split("-")[1]);
  for (let i = 0; i <= 12 - start_m; i++) {
    let t = {
      date: `${now_y}.${start_m + i}`, // 分类标签
      // 判断条件
      time: {
        start: new Date(`${now_y}-${start_m + i}-1 00:00:00`).getTime(),
      },
      income: 0, // 收入
    };
    // 涉及月份增加 要判断是否到达12月 已经是12月 则年份增加 月份置为1
    if (start_m + i == 12) {
      t.time.end = new Date(`${now_y + 1}-1-1 00:00:00`).getTime();
    } else {
      t.time.end = new Date(`${now_y}-${start_m + i + 1}-1 00:00:00`).getTime();
    }
    list.push(t);
  }
  return { msg: "统计成功", code: 200, data: statistic(list, res.data) };
}

// 云函数入口函数
exports.main = async (event, context) => {
  let { type, condition } = event;
  // 先查出时间段内 涉及 的 所有 已确认 订单
  switch (type) {
    case "year":
      return await year(condition);
    case "month":
      return await month(condition);
  }
};
