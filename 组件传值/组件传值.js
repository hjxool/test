// Vue.config.productionTip = false;
let app = Vue.createApp({
	data() {
		return {
			bbb: 'dasdas',
		};
	},
});
app.mount('.aaa');
app.component('dwdw_dwdw', {
	props: ['cCc'],
	provide() {
		return {
			// rrr: this.cCc,//此方法没有响应性，更新一次后即不在刷新
			rrr: Vue.computed(() => this.cCc),
		};
	},
	template: `<qweqwe-qwe></qweqwe-qwe>`,
});
app.component('qweqwe-qwe', {
	inject: ['rrr'],
	data() {
		return {
			ddd: '组件qwe',
		};
	},
	computed: {
		tru() {
			console.log(this.rrr);
			return this.rrr.value.length;
		},
	},
	template: `<span>{{ddd}}-{{rrr}}-{{rrr.value}}-{{tru}}</span>`,
});
