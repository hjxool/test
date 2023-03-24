function fn() {
	console.log('hhhhhh');
}
// module.exports = fn;

let aaa = 'aaa';
// module.exports = {
// 	fn,
// 	aaa,
// };

exports.fn = fn;
exports.aaa = aaa;
