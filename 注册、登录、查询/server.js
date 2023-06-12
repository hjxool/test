// 连接服务器、集合
const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	console.log('连接成功');
});
mg.connect.on('error', () => {
	console.log('连接异常');
});
mg.connect.on('close', () => {
	console.log('连接关闭');
});
let type = new mg.Schema({
	name: String,
	password: String,
});
const model = mg.model('users', type);
// 导入express
const express = require('express');
const app = express();
// 设置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 首先是页面等静态资源
app.use(express.static(__dirname));
app.get('/', (req, res) => {
	res.redirect('./login.html');
});
// 设置路由、接口
app.post('/');
app.all('*', (req, res) => {
	res.send('404 not found');
});
