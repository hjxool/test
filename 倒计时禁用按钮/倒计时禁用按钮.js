let a = new Vue({
	el: '#test',
	data() {
		return {
			btn_text: '发送验证码',
			count: 10,
			ban: false,
			// 深度监听
			obj1: {
				obj2: '123',
			},
			// class名：true/false，实验class名能否当作vue实例中的属性对象操作(可以)
			obj3: {
				aaa: true,
			},
			styleobj: {
				color: 'red',
			},
		};
	},
	methods: {
		count_down() {
			this.ban = true;
			let timer = setInterval(() => {
				this.btn_text = `${this.count}s后重新发送`;
				this.count--;
				if (this.count == 0) {
					this.btn_text = '重新发送验证码';
					this.ban = false;
					this.count = 10;
					clearInterval(timer);
				}
			}, 1000);
			return this.btn_text;
			// this.obj3.aaa = !this.obj3.aaa;
		},
	},
	watch: {
		count(newv, oldv) {
			console.log(this.obj1.obj2);
		},
	},
	computed: {
		test() {
			return `${this.btn_text}+${this.count}`;
		},
	},
});
// console.log(a.test);输出string
// console.log(a.count_down);整个函数体
// console.log(a.count_down());输出函数结果
// console.log(typeof a.test);类型也是string
// console.log(typeof a.count_down);类型function
// console.log(typeof a.count_down());没有返回值就是undefined
let array = ['daas', '12321'];
function xxx(param) {
	console.log(param);
}
xxx(...array);
