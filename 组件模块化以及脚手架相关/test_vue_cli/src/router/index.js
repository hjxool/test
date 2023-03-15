import VueRouter from 'vue-router';
// 引入组件
import school from '../components/school';
import student from '../components/student';

export default new VueRouter({
	routes: [
		{
			path: '/school',
			component: school,
		},
		{
			path: '/student',
			component: student,
		},
	],
});
