function count(num) {
	return num < 2 ? 1 : count(num - 1) + count(num - 2);
}
var onmessage = function (e) {
	console.log('开始计算');
	let res = count(e.data);
	postMessage(res);
};
