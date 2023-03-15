<template>
	<div class="aaa">
		<router-link class="route" active-class="active" to="/school">切换到school</router-link>
		<router-link class="route" active-class="active" to="/student">切换到student</router-link>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less">
.aaa {
	position: absolute;
	top: calc(50% - 25px);
	left: calc(50% - 25px);
	.route {
		width: 50px;
		height: 50px;
		background-color: blue;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.active {
		background-color: antiquewhite;
		color: aquamarine;
	}
}
</style>
