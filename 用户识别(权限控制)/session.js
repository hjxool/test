const express = require('express');
const app = express();

// 测试 连接数据库 创建用户信息 根据数据确认身份
// const mg = require('mongoose');
// mg.connect('mongodb://127.0.0.1:27017/customdb');
// mg.connection.once('open', () => {
// 	console.log('数据库已连接');
// });
// mg.connection.on('close', () => {});
// mg.connection.on('error', () => {
// 	console.log('数据库连接失败');
// });
// let dt = new mg.Schema({
// 	name: String,
// 	price: String,
// 	num: Number,
// });
// let model = mg.model('test2', dt);
// app.get('/login', (req, res) => {
// 	model.find({ _id: '646dddcc94cf30cef7076975' }).then((data) => {
// 		console.log(data);
// 		res.send(`你好 ${data[0].name}`);
// 	});
// });

// 测试 使用express-session、connect-mongo工具包进行session设置
const session = require('express-session');
const cm = require('connect-mongo');
app.use(
	session({
		name: 'sid', //设置cookie的name，默认值：connect.sid
		secret: 'key', //参与加密的字符串(签名/密钥)
		saveUninitialized: false, //是否每次请求设置一个cookie存储session的id，为true则不用session也会创建空对象
		resave: true, //是否每次请求重新保存session(延续生命周期)，如20分钟过期，只要操作间隔不大于20分钟就一直不会过期
		store: cm.create({
			mongoUrl: 'mongodb://127.0.0.1:27017/customdb', //数据库连接配置
		}),
		cookie: {
			httpOnly: true, //前端是否可通过JS操作cookie
			maxAge: 60 * 1000, //控制 sessionID 的过期时间(包括浏览器cookie、数据库session过期时间)
		},
	})
);
app.get('/login', (req, res) => {
	if (req.query.name === 'admin' && req.query.password === 'admin') {
		// 设置 session 信息
		req.session.username = 'admin';
		req.session.password = 'admin';

		res.send('登陆成功');
	} else {
		res.send('登陆失败');
	}
});
// 读取 session
app.get('/home', (req, res) => {
	// 中间件已经根据浏览器请求中携带的cookie获取session id并在数据库中查询将查询结果放入req对象中
	if (req.session.username) {
		res.send(`欢迎 ${req.session.username} 登录`);
	} else {
		res.send('你还没有登录');
	}
});
// 销毁 session
app.get('/loginout', (req, res) => {
	req.session.destroy(() => {
		res.send('退出登录');
	});
});

app.listen('30', () => {
	console.log('30端口监听中');
});
