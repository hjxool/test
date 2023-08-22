const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	// 首先要创建文档结构对象 其实就是定义数据类型
	let dataType = new mg.Schema({
		name: String,
		price: String,
		num: Number,
		list: Array,
		obj: Object,
	});
	// 然后创建模型对象 其实就是指定要操作所连接数据库下哪个集合,并限制集合下文档字段数据类型
	// 如果没有对应集合则会新建
	let obj = mg.model('test2', dataType);
	// 测试 新增文档
	obj
		.create({
			name: '测试多层级对象及数组',
			list: [
				{ aaa: 1, bbb: 2 },
				{ aaa: 33, bbb: 55 },
			],
			obj: {
				ooo: {
					yyy: 1,
				},
				pp: 'ss',
			},
		})
		.then(
			(data) => {
				mg.disconnect();
				console.log('创建成功' + data);
			},
			(err) => {
				console.log('创建失败' + err);
			}
		);
});
mg.connection.on('error', () => {
	console.log('连接失败');
});
mg.connection.on('close', () => {
	console.log('连接关闭');
});
// 测试关闭连接
// setTimeout(() => {
// 	mg.disconnect();
// }, 2000);
