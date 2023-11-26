// 安装 并引入 ws模块
const WebSocket = require('ws');
// 开启服务
const wss = new WebSocket.Server({ port: 3000 });
// 设置连接相关事件回调
let link_index = 0;
wss.on('connection', (link) => {
	console.log('连接对象', link);
	link_index++;
	// link用于区分 不同的 单一连接
	console.log(`与${link_index}号建立连接`);
	// 注：单一连接断开等事件回调必须在连接成功回调里设置
	link.on('close', () => {
		console.log(`与${link_index}号连接断开`);
	});
	link.on('message', (data) => {
		console.log('服务器收到消息', data);
		// 发送消息使用send方法
		link.send('服务端收到消息并回复');
	});
});
