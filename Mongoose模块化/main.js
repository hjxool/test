// 导入基础代码
const db = require('./base.js');
// 导入mongoose
const mg = require('mongoose');
// 导入结构对象
const b2m = require('./base2.js');

// 设置回调
db(() => {
	b2m.find().then((data) => {
		mg.disconnect();
		console.log('读取成功' + data);
	});
});
