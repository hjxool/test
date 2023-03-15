let a = new Vue({
	el: '#aaa',
	data() {
		return {
			key_word: [],
			sort_type: 0, //0是原顺序 1是升序 2是降序
			list: [
				{ id: '001', name: '马冬梅', age: 30, sex: '女' },
				{ id: '002', name: '周冬雨', age: 31, sex: '女' },
				{ id: '003', name: '周杰伦', age: 18, sex: '女' },
				{ id: '004', name: '温兆伦', age: 21, sex: '女' },
			],
			// filter_list: [],
		};
	},
	// #region
	// watch: {
	// 	key_word: {
	// 		immediate: true,
	// 		handler(val) {
	// 			this.filter_list = this.list.filter((p) => {
	// 				return p.name.indexOf(val) !== -1;
	// 			});
	// 		},
	// 	},
	// },
	// #endregion
	computed: {
		// #region
		// filter_list() {
		// 	return this.list.filter((p) => {
		// 		return p.name.indexOf(this.key_word) !== -1;
		// 	});
		// },
		// #endregion
		filter_list() {
			let arry = this.list.filter((p) => {
				return p.name.indexOf(this.key_word) !== -1;
			});
			switch (this.sort_type) {
				case 1:
					arry.sort((a, b) => {
						return a.age - b.age;
					});
					break;
				case 2:
					arry.sort((a, b) => {
						return b.age - a.age;
					});
					break;
			}
			return arry;
		},
	},
	methods: {
		fun() {
			console.log('触发');
		},
	},
});
// let obj1 = {};
// let test_text = 78;
// Object.defineProperty(obj1, 'test_text', {
// 	// value: 78,
// 	// enumerable: true,
// 	// writable: true,
// 	get() {
// 		console.log('get触发');
// 		return test_text;
// 	},
// 	set(val) {
// 		console.log('set触发');
// 		test_text = val;
// 	},
// });
// document.getElementById('obj_define_test').innerHTML = obj1.test_text;
// let aaaa = {
// 	name: 'asdasd',
// 	ccc: 'asdasdas',
// };
// let bbbb = {
// 	name: 'dasdasda',
// 	ddd: 'qwqweqwe',
// };
