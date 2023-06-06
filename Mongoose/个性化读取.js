let mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	let datatype = new mg.Schema({
		name: String,
		price: String,
		num: Number,
	});
	let obj = mg.model('test2', datatype);
	obj
		.find()
		.limit(1)
		// .exec()
		.then((data) => {
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
