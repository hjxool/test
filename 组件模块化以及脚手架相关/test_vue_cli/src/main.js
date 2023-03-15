import Vue from 'vue';
import App from './App.vue';
// import mix from './混合';
import plugins from './插件.js';
// 引入vuex实例对象 文件夹下是index开头的文件触发简写形式
import store from './store';
// 引入路由应用插件
import VueRouter from 'vue-router';
import router from './router';

Vue.config.productionTip = false;
// Vue.mixin(mix);
Vue.use(plugins);
Vue.use(VueRouter);

new Vue({
	render: (h) => h(App),
	store,
	router: router,
}).$mount('#app');
