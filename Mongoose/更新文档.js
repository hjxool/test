const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');

mg.connection.once('open', () => {
	let datatype = new mg.Schema({
		name: String,
		price: String,
		num: Number,
	});
	let obj = mg.model('test2', datatype);
	// obj.updateOne({ price: '300' }, { name: 'test' }).then(
	// 	(data) => {
	// 		mg.disconnect();
	// 		console.log('成功' + data);
	// 	},
	// 	(err) => {
	// 		mg.disconnect();
	// 		console.log('失败' + err);
	// 	}
	// );
	obj.updateMany({ price: '300' }, { name: 'test2' }).then(
		(data) => {
			mg.disconnect();
			console.log('成功' + data);
		},
		(err) => {
			mg.disconnect();
			console.log('失败' + err);
		}
	);
});
mg.connection.on('error', () => {
	console.log('连接失败');
});
mg.connection.on('close', () => {
	console.log('关闭连接');
});
