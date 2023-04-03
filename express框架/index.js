const express = require('express');
const app = express();
app.get('/home', (req, res) => {
	console.log(req, res);
	res.setHeader('content-type', 'text/html;charset=utf-8');
	res.end('收到');
});
app.get('/', (req, res) => {
	res.end('end');
});
app.listen('3000', () => {
	console.log('服务已启动');
});
