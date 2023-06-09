const mg = require('mongoose');

let dataType = new mg.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	num: {
		type: String,
		default: 1,
	},
});
module.exports = mg.model('test2', dataType);
