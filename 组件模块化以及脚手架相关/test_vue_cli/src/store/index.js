import Vue from 'vue';
import Vuex from 'vuex';
// 发送commit请求 中转站 判断
const actions = {
	// 传入两个参数
	jia(mini_store, value) {
		// console.log(mini_store, value);
		mini_store.commit('JIA', value);
	},
};
// 实际执行操作
const mutations = {
	// 第一个参数是公共存储数据 第二个参数是commit传进来的值
	JIA(state, value) {
		// console.log(state, value);
		state.sum += value;
	},
};
// 存储公共数据
const state = {
	sum: 0,
};
// 跟计算属性同样功能的属性
const getters = {
	sum10(state) {
		return state.sum * 10;
	},
};
// 必须要引入vue应用vuex插件 才能使用new vuex
Vue.use(Vuex);
export default new Vuex.Store({
	// 属性名和赋值对象名相同 触发简写形式
	actions,
	mutations,
	state,
	getters,
});
