const ejs = require('ejs');

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
// const express = require("express");
// const app = express();
// let content = "这是内容";
// let title = "标题测试";
// const fs = require("fs");
// let file = fs.readFileSync("./test2.html").toString();
// let res = ejs.render(file, { title, content });
// console.log(res);
// app.get("/", (req, res) => {
// 	res.send(res);
// });
// app.listen("80", () => {
// 	console.log("80端口监听");
// });

// 测试 ejs的v-for
// let arr = ['ada', 'bbb', 'qweq', 'rrrr'];
// let res = ejs.render(
// 	`
//     <%arr.forEach(item =>{%>
//          <li><%=item%></li>
//     <%})%>
// `,
// 	{ arr }
// );
// console.log(res);

// 测试 ejs的条件渲染
// let flag = false;
// let res = ejs.render(
// 	`
//   <% if(hhh){ %>
//     <button>结果为true</button>
//   <% }else{ %>
//     <button>结果为false</button>
//   <% } %>
// `,
// 	{ hhh: flag }
// );
// console.log(res);

// 测试 express中使用ejs
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('view', `${__dirname}`);
app.get('/', (req, res) => {
	let text = 'hahahahah';
	res.render('test3', { title: text });
});
app.listen('80', () => {
	console.log('80端口正在监听');
});
