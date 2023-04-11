const express = require('express');
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

// 测试案例
// app.use(express.static(__dirname));
// app.get('/', (req, res) => {
// 	// res.redirect('./test.html');
// 	// res.sendFile(__dirname + '/test.html');
// });
// const fs = require('fs');
// const parse = require('body-parser');
// const json = parse.json();
// const query = parse.urlencoded({ extended: false });
// app.post('/login', query, (req, res) => {
// req.on('data', (chunk) => {
// 	console.log(chunk.toString());
// 	fs.appendFileSync('./request.log', chunk);
// });
// req.on('end', () => {
// 	console.log('结束');
// 	res.sendFile(__dirname + '/request.log');
// });
// 	res.send(req.body);
// });

// 防盗链测试
// app.use((req, res, next) => {
// 	let url = req.get('referer');
// 	if (url) {
// 第一种方法用正则
// let reg = /^https?:\/\/(?<a>[0-9\.a-zA-Z]+)(:[0-9]+)?\//g;
// req.cus_params = reg.exec(url).groups.a;
// 第二种方法 URL
// 		let obj = new URL(url);
// 		req.cus_params = obj.hostname;
// 		if (req.cus_params !== '127.0.0.1') {
// 			res.status(404).send('<h1>404 NOT FOUND</h1>');
// 			return;
// 		}
// 	}
// 	next();
// });
// app.use(express.static(__dirname));
// app.post('/login', (req, res) => {
// 	res.send(req.cus_params);
// });

// 测试路由模块化
const router1 = require('./路由模块化/router1');
const router2 = require('./路由模块化/router2');
app.use(router1);
app.use(router2);

app.listen('5500', () => {
	console.log('5500端口监听');
});
// const t = require('./test.js');
// console.log(t);
