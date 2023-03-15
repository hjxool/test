<template>
	<div>
		<!-- <school></school>
		<student></student> -->
		<router></router>
		<router-view></router-view>
	</div>
</template>

<script>
// 引入子组件
import school from './components/school.vue';
import student from './components/student.vue';
import router from './components/router.vue';

export default {
	components: {
		school,
		student,
		router,
	},
};
</script>

<style></style>
