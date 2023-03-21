const http = require('http');

const server = http.createServer((request, response) => {
	response.setHeader('content-type', 'text/html;charset=utf-8');
	response.end('收到收到,roger that');
});

server.listen(9000, () => {
	console.log('服务已启动...');
});
