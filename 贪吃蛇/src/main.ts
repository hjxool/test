// 引入打包资源
import './index.css'
import { createApp, toRefs, reactive } from 'vue'

// 创建实例
createApp({
  setup(props) {
    let obj1 = {
      aaa: '1111',
      bbb: [5, 6, 7],
      ccc: {
        ddd: false
      }
    }
    console.log(toRefs(obj1))
    console.log(reactive(obj1))
    return {
      ...toRefs(obj1),
    }
  }
}).mount('#main')