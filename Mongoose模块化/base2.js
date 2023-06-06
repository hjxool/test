// 导入mongoose
const mg = require('mongoose');
// 创建结构对象
let dataType = new mg.Schema({
	name: String,
	price: String,
	num: Number,
});
let model = mg.model('test2', dataType);
// 将结构对象暴露出去
module.exports = model;
