const fs = require('fs');
// import * as fs from 'fs';
fs.writeFile('./fs.js', 'let t = "三人行必有我师"', (err) => {
	err ? console.log('失败') : console.log('成功');
});
