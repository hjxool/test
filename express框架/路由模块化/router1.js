const express = require('express');
const app = express.Router(); // 创建路由对象

app.get('/', (req, res) => {
	res.send('首页');
});
app.get('/home', (req, res) => {
	res.send('首页2');
});

module.exports = app;
