const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	let dataType = new mg.Schema({
		name: {
			type: Number,
			enum: ['苹果', '菠萝'],
		},
		price: String,
		num: Number,
	});
	let obj = mg.model('test2', dataType);
	// 测试 新增文档
	obj
		.create({
			name: 22,
			price: '30',
			num: 220,
		})
		.then(
			(data) => {
				mg.disconnect();
				console.log('创建成功' + data);
			},
			(err) => {
				mg.disconnect();
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
