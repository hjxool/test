import vue from '../js/main.js'
const { createApp, toRefs } = vue

createApp({
  setup(props) {
    let obj: {
      aaa: string
    }
    obj = {
      aaa: '123'
    }
    return { ...toRefs(obj) }
  }
}).mount('#main')