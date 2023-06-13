const jwt = require('jsonwebtoken');

// 测试 生成校验
let token = jwt.sign(
	{
		name: 'testUser',
		password: 111111,
	},
	'secret',
	{
		expiresIn: 30, // 单位秒
	}
);
console.log(token);
jwt.verify(token, 'secret', (err, data) => {
	if (err) {
		console.log('err');
		return;
	}
	console.log(data);
});

// 测试 verify函数返回结果是Promise对象吗？ 答案不是
// jwt.verify(token, 'secret').then((res) => {
// 	console.log(res);
// });

// 测试 换一个加密字符串会如何？ 答案触发err 提示无效签名
// jwt.verify(token, 'secretkey', (err, data) => {
// 	if (err) {
// 		console.log('err');
// 		console.log(err);
// 		return;
// 	}
// 	console.log(data);
// });
