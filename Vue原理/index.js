class CusVue {
	constructor(obj) {
		// ES5代理方式使用闭包 可以将目标对象改造成代理
		this.$data = obj.data;
		observerOld(this.$data);

		// 新代理方式返回的是一个代理对象
		// this.$data = observerNew(obj.data);

		compile(obj.el, this); // this即通过new CusVue创建的实例vm
	}
}
// 数据监听
// Vue3以后用proxy
function observerNew(obj) {
	if (typeof obj !== 'object') {
		return obj;
	} else {
		const depend = new Dependency();
		return new Proxy(obj, {
			get(target, key, receiver) {
				console.log(`读取属性${key}`);
				// proxy和defineProperty在递归代理子属性对象的区别：
				// proxy在get return时进行递归，因为proxy返回的是一个新生成的对象
				// 需要用return来传递

				if (Dependency.temp) {
					// 将其存入订阅者数组中 这样实例对象就不会被释放
					// 而是在更新时调用其身上的回调函数
					depend.addSub(Dependency.temp);
				}

				// defineProperty是对对象自身进行代理，所以可以在代理对象前/后进行子对象代理
				return observerNew(target[key]);
			},
			set(target, key, value, receiver) {
				console.log(`修改属性${key}`);
				target[key] = value;
				// 在get时才进行递归代理,所以修改基本类型属性为对象
				// 并不会导致丢失代理 因为修改新赋值对象里的属性值时必然会先触发get

				// 在修改的属性层触发其存储的订阅者数组更新
				depend.notify();
			},
		});
	}
}
// #region
// let t = {
//     a: 111,
//     b: {
//         c: 222
//     }
// }
// let p = observerNew(t)
// 测试 读取属性
// console.log(p.a)

// 测试 修改值为基本类型属性 并读取
// p.a = 333
// p.b.c = 333
// console.log(p.a)

// 测试 修改基本类型属性值为对象 并读取
// p.a = {
//     d: 333
// }
// p.a
// p.a.d = 444

// 测试 修改子对象 并读取
// p.b = {
//     e: 444
// }
// p.b.e

// 测试 修改基本类型为对象后再修改能否拦截到
// p.a = {
//     d: 33
// }
// p.a.d = 44
// p.a = {
//     e: 55
// }
// #endregion

// Vue2用Object.defineProperty
function observerOld(obj) {
	// 子属性是对象则遍历进行代理
	if (typeof obj !== 'object') {
		return;
	} else {
		const depend = new Dependency();
		for (let key in obj) {
			// 关键点 设置局部变量形成闭包 而不是直接读取修改 避免死循环
			let value = obj[key];
			// 子属性数据劫持
			observerOld(value);
			Object.defineProperty(obj, key, {
				enumerable: true,
				configurable: true,
				get() {
					console.log('读取属性' + key);
					// 关键点 此时正是创建订阅者实例对象 读取身上属性触发get方法
					// 此时临时变量里还存着当前正在创建的实例对象索引
					if (Dependency.temp) {
						// 将其存入订阅者数组中 这样实例对象就不会被释放
						// 而是在更新时调用其身上的回调函数
						depend.addSub(Dependency.temp);
					}
					// 如果是对象 返回的是对象地址
					return value;
				},
				set(newValue) {
					console.log('修改属性' + key);
					value = newValue;
					// 修改时也可能赋值对象 就要对新值进行代理
					observerOld(newValue);
					// 在修改的属性层触发其存储的订阅者数组更新
					depend.notify();
				},
			});
		}
	}
}
// #region
// let t = {
//     a: 111,
//     b: {
//         c: 222
//     }
// }
// observerOld(t)
// 测试 读取属性
// t.b.c

// 测试 修改值为基本类型属性 并读取
// t.a = 333
// t.a

// 测试 修改基本类型属性值为对象 并读取
// t.a = {
//     d: 333
// }
// t.a.d
// #endregion

// 解析模板 生成虚拟DOM树
function compile(element, vm) {
	vm.$el = document.querySelector(element);
	const fragment = document.createDocumentFragment();
	let child;
	while ((child = vm.$el.firstChild)) {
		// appendChild会将child从真实DOM中移除
		// 所以firstChild就移向下一个节点
		fragment.appendChild(child);
	}
	function fragmentCompile(node) {
		// 插值语法只匹配text节点 节点类型为3
		if (node.nodeType === 3) {
			// {}是特殊符号需要\转义 插值语法中可能有空格也要进行匹配
			// 用()包裹要替换匹配的字符
			let reg = /\{\{\s*(\S+)\s*\}\}/;
			// 这里要用exec而不是test 因为要取出插值语法中非空格的字符进行替换
			let result = reg.exec(node.nodeValue);
			// 返回值为null或者结果数组
			if (result) {
				// 这里要保存下原始HTML中插值字符串 便于后面更新数据挂载页面时以其为基础
				// 更新节点文本
				let source = node.nodeValue; // {{xx}}

				// 空格和换行都是text节点 用正则将其过滤
				// 结果数组 第一个元素是完整匹配结果 往后是按顺序用()包裹的子匹配结果
				// console.log(result[1])
				// 解析插值语法内的变量取值路径 取出值替换插值语句
				let value = path_list(result[1]).reduce((total, current) => {
					return total[current];
				}, vm.$data); // xx: 12
				// 首次将数据挂载到页面 将原先HTML节点中的{{xx}} 替换为变量xx的值
				node.nodeValue = node.nodeValue.replace(reg, value); // <div>12</div>

				// 创建订阅者
				// 注意！这里是在局部作用域中创建实例对象 没有赋值变量使用正常会被内存回收
				// 内存回收机制的关键在于 是否有被其他地方使用或长期保存
				// 这里有个很巧妙的点 就是这个新创建的实例对象不是存在这里赋值变量保存
				// 而是在创建实例时就读取一遍身上的属性 触发一遍get方法
				new Watcher(vm, result[1], (newValue) => {
					// 一个节点只会存在于一个地方 不管是在文档片段还是真实DOM
					// 此处已经将有插值语法的节点保存在闭包中了
					// 后续 xx: 55 后将 {{xx}}更新到页面 <div>55</div>
					node.nodeValue = source.replace(reg, newValue);
				});
				// return;
			}
		}
		// v-model只匹配input类型节点 节点类型为1 且节点名称为INPUT
		if (node.nodeType === 1 && node.nodeName === 'INPUT') {
			// node.attributes是节点上的属性
			for (let val of node.attributes) {
				// 只有属性名为v-model才解析
				if (val.nodeName === 'v-model') {
					let path = path_list(val.nodeValue);
					// 第一次挂载时同样要取JS数据替换到页面
					// 但与文本节点不同的是 input关联的JS字段路径已经写在v-model里了
					// 所以不需要使用正则匹配
					let value = path.reduce((total, current) => {
						return total[current];
					}, vm.$data);
					// 因为是input节点 需要修改的是value属性 而不是nodeValue
					node.value = value;
					// 同文本节点 一样要设置更新节点回调
					new Watcher(vm, val.nodeValue, (newValue) => {
						node.value = newValue; // 不是插值语法不需要正则替换
					});

					// 也要设置input输入 修改JS数据
					// 是赋值操作 需要找到目标属性的上级
					// 因为直接找到最后以及取到的是值 而不是内存地址
					// 我们需要的是根据内存地址 修改其下属性
					node.addEventListener('input', (event) => {
						// 取出路径数组最后一级之前的父对象
						let parent = path.slice(0, path.length - 1).reduce((total, current) => {
							return total[current];
						}, vm.$data);
						parent[path[path.length - 1]] = event.target.value;
					});
					break;
				}
			}
		}
		// 如果不是文本节点则递归解析子节点
		for (let val of node.childNodes) {
			fragmentCompile(val);
		}
	}
	fragmentCompile(fragment);
	// 将编辑好的文档片段插入真实DOM
	vm.$el.appendChild(fragment);
}
// 将取值路径字符串转换为数组
function path_list(str) {
	// 先按.拆成数组 [a, b[2]]
	let list = str.split('.');
	for (let i in list) {
		let val = list[i];
		// 找到带[的元素
		if (val.indexOf('[') !== -1) {
			// 将其以[拆成数组 ['b', '2]']
			let array = val.split('[');
			let t = [];
			// 遍历 将]剔除 组成新的数组 因为用splice方法必须知道]位置索引
			// 而replace又不能修改原数组 只能将替换生成的新元素组成新数组再替换[a, b[2]]中的b[2]
			for (let val2 of array) {
				let t2 = val2.replace(']', '');
				t.push(t2);
			}
			list.splice(Number(i), 1, ...t);
		}
	}
	return list;
}
// 依赖 通知订阅者 JS数据变化通知更新HTML页面
class Dependency {
	constructor() {
		// 存储订阅者数组
		this.subscribers = [];
	}
	addSub(sub) {
		this.subscribers.push(sub);
	}
	notify() {
		// 一收到更新页面通知 批量更新挂载到页面
		for (let val of this.subscribers) {
			val.update();
		}
	}
}

// 订阅者
class Watcher {
	constructor(vm, key, callback) {
		this.vm = vm;
		this.key = key;
		this.callback = callback;
		// 关键点 添加一个 全局的 临时变量 用于存储当前正在创建的实例对象
		Dependency.temp = this;
		// 然后通过读取属性 触发一遍 数据代理get方法
		path_list(key).reduce((total, cur) => {
			return total[cur];
		}, vm.$data);
		// 绝的地方就在这 此处是同步执行 读取完属性之后才会清除这个全局变量
		// 使得再次触发数据代理get方法不会重复添加订阅者
		Dependency.temp = null;
	}
	// 生命周期update 用于在数据变化时更新页面
	update() {
		let value = path_list(this.key).reduce((total, cur) => {
			return total[cur];
		}, this.vm.$data);
		this.callback(value);
	}
}

// 测试CusVue
let cusVm = new CusVue({
	el: '.root',
	data: {
		text1: '文本1',
		test2: {
			b: {
				c: ['文本2-1', '文本2-2'],
			},
		},
	},
});
function fn() {
	// cusVm.$data.text1 = '修改文本1';
	cusVm.$data.test2.b.c[1] = '修改文本2-2';
	// cusVm.$data.test2.b.c.splice(1, 1, '修改文本2-2');
}
