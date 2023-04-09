const express = require("express");
const app = express();

// app.all('*', (req, res) => {
// 	console.log(req);
// 	res.end('404');
// });

// app.get("/:id1/:id2.html", (req, res) => {
// res.setHeader('content-type', 'text/html;charset=utf-8');
// console.log(req.params);
// res.send(JSON.stringify(req.params));
// });

// app.get('/', (req, res) => {
// 	res.end('end');
// });

// app.all('/', (req, res) => {
// 	console.log('收到请求');
// res.redirect('./login');
// res.download('./test.txt', '新名字.txt');
// const fs = require('fs');
// let data = fs.readFileSync('./package.json');
// res.json(data.toString());
// res.json({ name: 123 });
// 	res.sendFile(__dirname + '/test.');
// });
// app.all('/login', (req, res) => {
// res.send(`console.log('login')`);
// res.download('./package.json');
// });

// 全局中间件
// const fs = require("fs");
// function callback(req, res, next) {
// 	let { url, ip } = req;
// 	fs.appendFileSync("request.log", `path:${url} IP:${ip}`);
// 	// next();
// }
// app.get("/", (req, res) => {
// 	console.log("收到请求");
// 	res.send("end");
// });
// app.use(callback);
// console.log("hou");

// 路由中间件
// function fn(req, res, next) {
// 	if (req.query.name === "hi") {
// 		next();
// 	}
// 	// else {
// 	res.send("错误");
// 	// }
// }
// app.get("/", fn, (req, res) => {
// 	res.send("正确1");
// });
// app.get("/home", fn, (req, res) => {
// 	res.send("正确2");
// });
// app.all("*", fn, (req, res) => {
// 	res.send("*号");
// });

// 静态资源读取
// app.all("*", (req, res) => {
// 	// res.redirect("./index.js");
// 	res.send("hhh");
// });
// app.use(express.static(__dirname));

app.listen("5500", () => {
	console.log("5500端口监听");
});
// const t = require('./test.js');
// console.log(t);
