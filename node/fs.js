const fs = require('fs');

// import * as fs from 'fs';

// fs.writeFile('./a/test.txt', '三人行必有我师', (err) => {
// 	err ? console.log('失败') : console.log('成功');
// });

// fs.appendFile('./fsText.txt', '\r\n追加内容', (err) => {
// 	err ? console.log('追加失败') : console.log('追加成功');
// });

// let ws = fs.createWriteStream('./fsText.txt');
// ws.write('test1');
// ws.write('test2');

// fs.readFile('./fsText.txt', (err, data) => {
// 	if (err) {
// 		console.log('读取失败');
// 		return;
// 	}
// 	console.log(data.toString());
// });

// let rs = fs.createReadStream('./test.mp4');
// rs.on('data', (chunk) => {
// 	console.log(chunk);
// 	console.log(chunk.length);
// });
// rs.on('end', (a) => {
// 	console.log('读取完成', a);
// });

// fs.readFile('./test.mp4', (err, data) => {
// 	fs.writeFile('./test2.mp4', data, (err) => {
// 		console.log('写入完成');
// 	});
// });

// let rs = fs.createReadStream('./test.mp4');
// let ws = fs.createWriteStream('./test2.mp4');
// rs.on('data', (chunk) => {
// 	ws.write(chunk);
// });
// rs.on('end', () => {
// 	console.log('写入完成');
// });

// fs.rename('./rename.txt', './a/rename2.txt', (err) => {
// 	if (err) {
// 		console.log('重命名失败');
// 		return;
// 	}
// 	console.log('重命名成功');
// });

// fs.mkdir('./test.txt', { recursive: true }, (err) => {
// 	if (err) {
// 		console.log('创建失败');
// 		return;
// 	}
// 	console.log('创建成功');
// });

// fs.readdir('./', (err, data) => {
// 	if (err) {
// 		console.log('读取失败');
// 		return;
// 	}
// 	console.log(data);
// });

// fs.stat('./', (err, data) => {
// 	if (err) {
// 		console.log('获取失败');
// 		return;
// 	}
// 	console.log(data);
// 	console.log(data.isFile());
// });

let filename = fs.readdirSync('./');
for (let val of filename) {
	if (val.indexOf('test') != -1) {
		let r = /test(?<num>\d+)/g;
		let num;
		for (let val2 of val.matchAll(r)) {
			num = Number(val2.groups.num) < 10 ? '0' + val2.groups.num : val2.groups.num;
		}
		fs.renameSync(`./${val}`, `./test${num}.mp4`);
	}
}
