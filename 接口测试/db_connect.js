module.exports = function () {
	let mg = require('mongoose');
	mg.connect('mongodb://127.0.0.1:27017/customdb');

	mg.connection.once('open', () => {
		console.log('连接Mongodb成功');
	});
	mg.connection.on('close', () => {
		console.log('数据库断开');
	});
	mg.connection.on('error', () => {
		console.log('连接Mongodb失败');
	});
};
