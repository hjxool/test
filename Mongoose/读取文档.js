let mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	let datatype = new mg.Schema({
		name: String,
		price: String,
		num: Number,
	});
	let obj = mg.model('test2', datatype);
	// 读取不到也不会读取失败 只会返回null
	// 读取单条
	// obj.findOne({ name: '茄子2' }).then(
	// 	(data) => {
	// 		mg.disconnect();
	// 		console.log('读取成功', data);
	// 	},
	// 	(err) => {
	// 		mg.disconnect();
	// 		console.log('读取失败');
	// 	}
	// );
	// 通过id读取
	// obj.findById('646dddcc94cf30cef7076975').then((data) => {
	// 	mg.disconnect();
	// 	console.log('读取成功' + data);
	// });
	// 批量查询
	// obj.find({ name: 'test2' }).then((data) => {
	// 	mg.disconnect();
	// 	console.log('读取成功' + data);
	// });
	// 读取所有
	obj.find().then((data) => {
		mg.disconnect();
		console.log('读取成功' + data);
	});
});
mg.connection.on('error', () => {
	console.log('连接失败');
});
mg.connection.on('close', () => {
	console.log('连接关闭');
});
