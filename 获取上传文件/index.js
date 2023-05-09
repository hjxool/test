const express = require('express');
const app = express();

// 测试 用body-parser工具获得的文件流是什么样子？
// 答：文件是二进制，且无法写入非字符串格式的文件
// const parser = require('body-parser');
// const data = parser.json();
// app.use(express.static(__dirname));
// app.get('/', (req, res) => {
// 	res.redirect('./index.html');
// });
// app.post('/test', data, (req, res) => {
// 	let fs = require('fs');
// 	fs.writeFile('./upload_file.png', req.body.file, (err) => {
// 		res.send('成功');
// 		if (err) {
// 			return;
// 		}
// 	});
// });

// 测试 通过http方法获取post请求体数据是什么样的
// 答：取得的数据转成字符串也难以解析
// app.use(express.static(__dirname));
// app.get('/', (req, res) => {
// 	res.redirect('./index.html');
// });
// app.post('/test', (req, res) => {
// 	req.on('data', (data) => {
// 		console.log(typeof data.toString());
// 	});
// 	req.on('end', () => {
// 		res.send('成功');
// 	});
// });

// 测试 用formidable工具保存文件到本地(服务器)
const formidable = require('formidable');
app.use(express.static(__dirname));
app.get('/', (req, res) => {
	res.redirect('./index.html');
});
app.post('/test', (req, res) => {
	let form = formidable({ multiples: true });
	form.parse(req, (err, fields, files) => {
		if (err) {
			next(err);
			return;
		}
		console.log(fields);
		console.log(files);
		res.send('ok');
	});
});

app.listen('44', () => {
	console.log('44端口监听');
});
