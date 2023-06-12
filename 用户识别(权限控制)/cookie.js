const express = require('express');
const app = express();

//测试 设置无时长cookie
// app.get('/login', (req, res) => {
// 	res.cookie('name', 'testUser');
// 	res.send('设置cookie');
// });

// 测试 设置cookie时长看关闭浏览器是否还会清除
// app.get('/login', (req, res) => {
// 	res.cookie('name', 'testUser', { maxAge: 2 * 60 * 1000 });
// 	res.send('设置cookie');
// });

// 测试 删除cookie
// app.get('/', (req, res) => {
// 	res.cookie('name', '张三');
// 	res.send('设置cookie');
// });
// app.get('/remove', (req, res) => {
// 	res.clearCookie('name');
// 	res.send('清除cookie');
// });

// 测试 删除所有cookie 答案是不行 只能一条条删
// app.get('/', (req, res) => {
// 	res.cookie('name', 'zhangsan');
// 	res.cookie('password', '111');
// 	res.cookie('age', '50');
// 	res.send('设置cookie');
// });
// app.get('/remove', (req, res) => {
// 	res.clearCookie();
// 	res.send('清除全部cookie');
// });

// 测试 读取cookie 需要安装cookie-parser工具包
const cp = require('cookie-parser');
app.use(cp());
app.get('/', (req, res) => {
	res.cookie('name', 'testUser');
	res.send('设置cookie');
});
app.get('/read', (req, res) => {
	res.send(`读取cookie:${JSON.stringify(req.cookies, null, 4)}`);
});

app.listen('30', () => {
	console.log('30端口监听中');
});
