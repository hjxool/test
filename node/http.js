const http = require("http");

const server = http.createServer((request, response) => {
	response.end("收到收到");
});

server.listen(9000, () => {
	console.log("服务已启动...");
});
