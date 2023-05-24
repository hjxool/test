const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');
mg.connection.once('open', () => {
	console.log('连接成功');
});
mg.connection.on('error', () => {
	console.log('连接失败');
});
mg.connection.on('close', () => {
	console.log('连接关闭');
});
// 测试关闭连接
setTimeout(() => {
	mg.disconnect();
}, 2000);
