<template>
	<div class="student">
		<h2>学生名{{ name }}</h2>
		<h2>{{ aaa }}</h2>
	</div>
</template>

<script>
// import mix from '../混合.js'
export default {
	data() {
		return {
			name: 'qwxczxczxc',
		};
	},
	// mixins:[mix]
};
</script>

<style>
.student {
	width: 500px;
	height: 50px;
	border: 1px solid red;
}
</style>
