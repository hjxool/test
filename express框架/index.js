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

app.all('/', (req, res) => {
	console.log('收到请求');
	// res.redirect('./login');
	res.download('./test.txt', '新名字.txt');
});
app.all('/login', (req, res) => {
	// res.send(`console.log('login')`);
	// res.download('./package.json');
});

app.listen('5500', () => {
	console.log('5500端口监听');
});
// const t = require('./test.js');
// console.log(t);
