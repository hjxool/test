const express = require("express");
const app = express();
// app.all('*', (req, res) => {
// 	console.log(req);
// 	res.end('404');
// });
app.get("/:id1/:id2.html", (req, res) => {
	// res.setHeader('content-type', 'text/html;charset=utf-8');
	console.log(req.params);
	res.send(JSON.stringify(req.params));
});
// app.get('/', (req, res) => {
// 	res.end('end');
// });

app.listen("3000", () => {
	console.log("服务已启动");
});
const t = require("./test.js");
console.log(t);
