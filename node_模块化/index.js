// const f = require('./module.js');

// const f = require('./test');

const f = require('./test2');
console.log(f);

function require(fp) {
	let path = __dirname + fp;
	if (c[path]) {
		return c[path];
	}
	let code = fs.readFileSync('path').toString();
	let module = {};
	let exports = (module.exports = {}(function (module, exports, __dirname, fp) {
		code;
	})(module, exports, __dirname, fp));
	return (c[path] = module.exports);
}
