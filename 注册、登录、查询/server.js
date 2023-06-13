// 连接服务器、集合
const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	console.log('连接成功');
});
mg.connection.on('error', () => {
	console.log('连接异常');
});
mg.connection.on('close', () => {
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

// 导入 session权限控制相关工具包
//#region
// const session = require('express-session');
// const cm = require('connect-mongo');
// app.use(
// 	session({
// 		name: 'sid',
// 		secret: 'key',
// 		saveUninitialized: false,
// 		resave: true,
// 		store: cm.create({
// 			mongoUrl: 'mongodb://127.0.0.1:27017/customdb',
// 		}),
// 		cookie: {
// 			httpOnly: true,
// 			maxAge: 60 * 1000,
// 		},
// 	})
// );
//#endregion

// 导入 token权限控制相关工具包
const jwt = require('jsonwebtoken');

// 查询集合
let type2 = new mg.Schema({
	name: String,
	price: String,
	num: Number,
});
const search_model = mg.model('test2', type2);

// 封装接口返回数据格式
function json(data, msg) {
	return {
		code: msg ? 400 : 200,
		msg: msg,
		data: data,
	};
}

app.get('/', (req, res) => {
	res.redirect('./login.html');
});
// 登录
app.post('/login', (req, res) => {
	let { name, password } = req.body;
	// 登录时到用户集合中去查
	model
		.find({ name })
		.then((data) => {
			console.log(data);
			if (data?.length) {
				return model.find({ name, password });
			} else {
				res.json(json(null, '用户不存在！'));
				throw new Error('用户不存在！');
			}
		})
		.then((data) => {
			if (data?.length) {
				// 登陆成功 设置临时通行证

				// session方式
				// req.session.name = name;
				// req.session.password = password;
				// res.json(json(null));

				// token方式
				let token = jwt.sign(
					{
						name,
						password,
					},
					'myKey',
					{
						expiresIn: 60,
					}
				);
				res.json(json(token));
			} else {
				res.json(json(null, '密码错误！'));
				throw new Error('密码错误！');
			}
		})
		.catch((err) => {
			console.log(err);
		});
});
// 注册
app.post('/register', async (req, res) => {
	// 先找是否有同名的再注册
	let name = req.body.name;
	// 注册时到用户集合查
	let data = await model.find({ name });
	if (data.length) {
		res.json(json(null, '用户已存在！'));
	} else {
		// 注册成功 往用户集合中添加文档
		model.create({ ...req.body });
		res.json(json(null));
	}
});

// 添加中间件检测登陆是否过期
let checkLogin = (req, res, next) => {
	// session方式
	// if (!req.session.name) {
	// 	return res.json(json(null, '登陆过期！'));
	// }
	// next();

	// token方式
	let token = req.get('customKey');
	console.log(!token);
	if (token && token !== 'undefined') {
		// 不要把空token传入校验会报错
		jwt.verify(token, 'myKey', (err, data) => {
			if (err) {
				console.log(err);
				return res.json(json(null, '登陆已过期！'));
			}
			next();
		});
	} else {
		res.json(json(null, '登陆已过期！'));
	}
};
// 查询数据
app.post('/search', checkLogin, async (req, res) => {
	// session校验通过 则到数据库检索需要的数据
	let data = await search_model.find();
	res.json(json(data));
});
// 登出
// session方式
// app.get('/loginout', checkLogin, (req, res) => {
// session方式
// req.session.destroy(() => {
// 	res.json(json(null));
// });
// });
// token方式
app.get('/loginout', (req, res) => {
	// token方式 因为token存储在客户端，因此不发给页面token即可
	// 即使记住地址跳转进页面也因为没有token而校验不过
	res.json(json(null));
});

app.all('*', (req, res) => {
	res.send('404 not found');
});

app.listen('80', () => {
	console.log('80端口监听中');
});
