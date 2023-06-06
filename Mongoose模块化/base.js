module.exports = function (success, error) {
	// 只有放入函数的才会执行
	const mg = require('mongoose');
	const { ip, port, db } = require('./config.js');
	//应用配置
	mg.connect(`mongodb://${ip}:${port}/${db}`);

	mg.connection.once('open', () => {
		console.log('连接成功');
		success();
	});
	mg.connection.on('error', () => {
		if (typeof error !== 'function') {
			error = () => {
				console.log('连接失败');
			};
		}
		error();
	});
	mg.connection.on('close', () => {
		console.log('连接关闭');
	});
};
