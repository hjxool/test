// 测试 类型不一致会如何 答：会提示报错，但依然会生成js文件
// let a: number
// a = 'hhh'
// 测试 函数类型声明
// function fn(a: number, b: number) {
//   return a + b
// }
// console.log(fn(22, 10))
// 测试 unknow类型可以赋值unknow类型吗？ 答：可以
// let a: unknown = 10
// let b: unknown
// b = a
// console.log(b)
// 测试 unknow类型可以赋值any类型吗？ 答：可以
// let a: unknown = 10
// let b
// b = a
// 测试 对象类型里指定属性类型
// let a: { name: string | number }
// a = {name:1}
// 测试 对象字面量和对象类型有区别吗 答：没有，只有对象中有值才有区别
// let a: object
// a = {}
// let b: {}
// b = { name: 1 }
// let c: { aaa: 123 }
// c = { aaa: 123 }
// 测试 对象类型少属性会报错吗 答：会报错，结构必须完全一致
// let a: { name: string, age: number }
// a = { name: 'hhh' }
// 测试 对象类型的？号 答：可选属性类型还是要一致
// let a: { name: string, age?: number }
// a = { name: 'hhh' }
// a = {name:'hhh', age:'12'}
// 测试 任意类型属性后可以添加？号吗 答：不能加？号
// let a: {name: string, [key:string]?:unknown}
// 测试 函数返回值声明可以在括号后加：类型吗 答：不行
var a;
a = function (p1, p2) {
    return p1 + p2;
};
a = function (a, b) {
    return a + b;
};
// 测试 箭头函数声明类型
// let a = (p1: number, p2: number): number => {
//   return 1
// }
