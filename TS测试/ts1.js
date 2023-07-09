// 测试 类型不一致会如何 答：会提示报错，但依然会生成js文件
// let a: number
// a = 'hhh'
// 测试 函数类型声明
// function fn(a: number, b: number) {
//   return a + b
// }
// console.log(fn(22, 10))
// 测试 unknow类型可以赋值unknow类型吗？
var a = 10;
var b;
b = a;
console.log(b);
