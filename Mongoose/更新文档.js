const mg = require('mongoose');
mg.connect('mongodb://127.0.0.1:27017/customdb');

mg.connection.once('open', () => {
	let datatype = new mg.Schema({
		name: String,
		price: String,
		num: Number,
	});
	let obj = mg.model('test2', datatype);
	// 更新单个
	// obj.updateOne({ price: '300' }, { name: 'test' }).then(
	// 	(data) => {
	// 		mg.disconnect();
	// 		console.log('成功' + data);
	// 	},
	// 	(err) => {
	// 		mg.disconnect();
	// 		console.log('失败' + err);
	// 	}
	// );
	// 批量更新
	// obj.updateMany({ price: '300' }, { name: 'test2' }).then(
	// 	(data) => {
	// 		mg.disconnect();
	// 		console.log('成功' + data);
	// 	},
	// 	(err) => {
	// 		mg.disconnect();
	// 		console.log('失败' + err);
	// 	}
	// );
	// 测试 更新多层级结构会只更新对应字段还是会整体替换？ 答:更新对应字段
	// obj.updateOne({ name: '测试多层级对象及数组' }, { obj: { pp: 'ww' } }) // 不能只写对应字段更新
	// obj.updateOne({ name: '测试多层级对象及数组' }, { obj: { yy: '22' } }) // 不能整体替换对象
	// obj.updateOne({ name: '测试多层级对象及数组' }, { obj: { ooo: { yyy: 22 }, pp: 'ww' } }) // 写全对象字段也不能更新
	// obj.updateOne({ name: '测试多层级对象及数组' }, { obj: 'ssss' }) // 替换整个字段也不行
	// obj.updateOne({ name: '测试多层级对象及数组' }, { list: ['ssss'] }) // 替换数组也不行
	// obj.updateOne({ name: '测试多层级对象及数组3' }, { 'obj.test1.test2': 3 }) //无法更新对象对应字段
	// obj.updateOne({ name: '测试多层级对象及数组3' }, { obj: { test3: 'aaa' } }) // 无法更新
	// obj.updateOne({ name: '测试多层级对象及数组3' }, { 'list.1.aaa': 66 }) // 不能这样更新数组元素
	// obj.updateOne({ name: '测试多层级对象及数组3' }, { $pop: { list: -1 } }) // 无法成功删除元素
	// obj.replaceOne({ name: '测试多层级对象及数组3' }, { obj: { newTest: 111 } }) // 会将整条文档销毁
	// obj.updateOne({ name: '测试多层级对象及数组3' }, { $set: { 'obj.test3': '33' } }) // 不成功
	// obj.updateOne({ name: '测试多层级对象及数组3' }, { $set: { 'list.0.aaa': 12 } }) // 不成功
	//   .then(
	// 	(data) => {
	// 		mg.disconnect();
	// 		console.log('成功' + data);
	// 	},
	// 	(err) => {
	// 		mg.disconnect();
	// 		console.log('失败' + err);
	// 	}
	// );
	// 测试 使用save
	obj.find({ name: '测试多层级对象及数组3' }).then((data) => {
		data[0].name = '使用save()更新文档2';
		// save()新版是Promise风格
		data[0].save().then(
			(res) => {
				mg.disconnect();
				console.log('成功');
			},
			(err) => {
				mg.disconnect();
				console.log('失败' + err);
			}
		);
		console.log('是不是异步');
	});
});
mg.connection.on('error', () => {
	console.log('连接失败');
});
mg.connection.on('close', () => {
	console.log('关闭连接');
});
