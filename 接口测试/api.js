const express = require('express');
const router = express.Router();
const model = require('./db_model');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

function json(data, msg) {
	return {
		code: msg ? 400 : 200,
		msg: msg,
		data: data,
	};
}

router.get('/getdata', (req, res) => {
	let query = req.query;
	model
		.find(query)
		.then((data) => {
			res.json(json(data));
		})
		.catch((err) => {
			res.json(json(err, err));
		});
});
router.post('/adddata', (req, res) => {
	// 操作数据库前加数据验证 并返回错误结果
	model
		.create(req.body)
		.then(() => {
			return model.find();
		})
		.catch((err) => {
			// catch后不会再往下执行了！因此可以放心.then
			// 不用担心失败后会执行后续.then
			res.json(json(null, err));
		})
		.then((data) => {
			res.json(json(data));
		});
});
router.get('/downloadfile', (req, res) => {
	res.download('./main.js');
});
const jwt = require('jsonwebtoken');
router.get('/get_token', (req, res) => {
	let token = jwt.sign(
		{
			test: 'hhhh',
		},
		'mykey',
		{ expiresIn: 60 * 10 }
	);
	res.json(json(token));
});
router.get('/downloadfile2', (req, res) => {
	// header携带token
	let token = req.get('token');
	// query参数携带token
	// let token = req.query.token;
	if (token !== 'undefined' && token !== null) {
		jwt.verify(token, 'mykey', (err, data) => {
			if (err) {
				res.json(json(null, '无效token'));
				return;
			}
			// 如果是从headers中取token说明客户端没法在新页签中打开下载
			// res.download('./main.js');
			// 所以需要重定向 到一个新页面下载
			// 测试 在当前页重定向到文件下载url 答案不是新页签发送的get不能触发浏览器下载
			// res.redirect('http://127.0.0.1:30/api/file1');
			// 测试 收到请求把连接发送给客户端 让其在新页签打开 使用另一文件接口下载
			res.json(json('http://127.0.0.1:30/api/file1'));
		});
	} else {
		res.json(json(null, '无效token'));
	}
});
router.get('/file1', (req, res) => {
	res.download('./main.js');
});

module.exports = router;
