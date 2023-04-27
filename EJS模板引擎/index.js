const ejs = require("ejs");

// 测试 拼接字符串
// let str = "love";
// let res = ejs.render("hhhh<%=str%>", { str });
// console.log(res);

// 测试 读取文件进行拼接
// const fs = require("fs");
// let data = fs.readFileSync("./test.txt").toString();
// let res = ejs.render(data, { str: "love" });
// console.log(res);

// 测试 类似vue的插值语法 并投射到接口返回页面
let content = "这是内容";
let title = "标题测试";
const fs = require("fs");
let file = fs.readFileSync("./test2.html").toString();
let res = ejs.render(file, { title, content });
console.log(res);
