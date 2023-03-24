const http = require('http');

// const server = http.createServer((request, response) => {
// 	let body = '';
// 	request.on('data', (chunk) => {
// 		console.log('片数据', chunk.toString());
// 		body += chunk;
// 	});
// 	request.on('end', () => {
// 		console.log('读取完毕', body);
// 		response.setHeader('content-type', 'text/html;charset=utf-8');
// 		response.end('收到收到,roger that');
// 	});
// });

// const url = require('url');
// const server = http.createServer((request, response) => {
// 	let res = url.parse(request.url, true);
// 	console.log(res.query);
// });

// const server = http.createServer((request, response) => {
// 	let url = new URL(request.url, 'http://127.0.0.1');
// 	console.log('url', url);
// 	console.log(url.searchParams.getAll('name'));
// });

// const server = http.createServer((request, response) => {
// 	let { method, url } = request;
// 	let { pathname } = new URL('http://127.0.0.1' + url);
// 	response.setHeader('content-type', 'text/html;charset=utf-8');
// 	if (method == 'GET' && pathname == '/login') {
// 		response.end('登录页');
// 	} else if (method == 'GET' && pathname == '/reg') {
// 		response.end('注册页');
// 	} else {
// 		response.end('404 NOT FOUND');
// 	}
// });

// const server = http.createServer((request, response) => {
// 	response.statusCode = 404;
// 	response.end('response');
// });

// const fs = require("fs");
// const path = require("path");
// const server = http.createServer((request, response) => {
// 	let { pathname } = new URL(`http://127.0.0.1${request.url}`);
// 	// let t = path.resolve(__dirname, pathname);
// 	// let t = __dirname + "/../" + "G/Git仓库/test" + pathname;
// 	// console.log(t);
// 	if (pathname == "/login") {
// 		let html = fs.readFileSync("./http.html");
// 		response.write(html);
// 		response.end();
// 	} else {
// 		// 这样无法获取上一层级目录下的文件
// 		fs.readFile(`.${pathname}`, (err, data) => {
// 			if (err) {
// 				response.statusCode = 500;
// 				response.end("404");
// 				return;
// 			}
// 			response.setHeader("content-type", "application/octet-stream");
// 			response.end(data);
// 		});
// 	}
// });

const server = http.createServer((request, response) => {
	switch (request.url) {
		default:
			response.end('404');
			break;
	}
	console.log(111111);
});

server.listen(9000, () => {
	console.log('服务已启动...');
});
