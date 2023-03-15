<template>
  <div class="school">
    <h2 @click="vuex_text">学校名：{{name}}--{{$store.state.sum}}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name:'eqweqweqwe'
    }
  },
  methods: {
    vuex_text(){
      // console.log(this)
      // 第一种写法
      // this.$store.dispatch('jia',2)
      // 第二种写法 当commit没有做特别的操作只传递数据 可以绕过commit
      this.$store.commit('JIA',2)
    }
  },
}
</script>

<style>
  .school{
    width: 400px;
    height: 50px;
    border: 1px solid;
  }
</style>