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

module.exports = router;
