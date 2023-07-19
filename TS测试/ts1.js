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
// let a: (p1: number, p2: number) => unknown
// a = (p1, p2) => {
//   return p1 + p2
// }
// a = (a: number, b): number => {
//   return a + b
// }
// a = (a) => {
//   return '可以少参数但不能多'
// }
// 测试 箭头函数声明类型
// let a = (p1: number, p2: number): number => {
//   return 1
// }
// 测试 声明数组元素类型
// let a: string[]
// a = ['1', '2']
// let b: Array<number>
// b = [1,2,'b']
// b = 1
// b = [1, 2]
// 测试 元组
// let a: [number, number]
// a = [1, 2]
// a = ['1', 2]
// a = [1,2,3]
// 测试 枚举
// enum test {
//   aaa = '123',
//   bbb = 'qqqq'
// }
// let eee = {
//   name: 'test',
//   ccc: test.aaa
// }
// 测试 类型别名
// type type1 = { name: string, age?: number }
// let a: type1
// a = { name: 'sss', age: 1 }
// 测试 合并后同名的全局变量如何编译 答：会报错
// let a = 'sss'
// 测试 类 答：只声明不赋值相当于空
// class Dog {
//   name: string
//   age: number
//   constructor(a: string, b: number) {
//     this.name = a
//     this.age = b
//   }
// }
// class Dog2 extends Dog {
//   hhh: unknown
//   constructor(a: string, b: number, c: string) {
//     super(a, b)
//     this.hhh = c
//   }
//   readonly hhh2: string
//   readonly fn() {
//   }
// }
// let a = new Dog2('asd', 1, '继承')
// console.log(a)
// 测试 基类
// abstract class P {
//   aaa: string
//   constructor(a) {
//     this.aaa = a
//   }
// }
// let p = new P('sd')
// 测试 抽象类中定义抽象方法，子类继承可以不重写吗 答：会报错，且抽象方法中不能写内容
// abstract class Phone {
//   name: string
//   constructor(name: string) {
//     this.name = name
//   }
//   abstract fn(): void {
//     return
//   }
// }
// class smartPhone extends Phone {
//   color: string
//   constructor(name: string, color: string) {
//     super(name)
//     this.color = color
//   }
//   fn(): void {
//     console.log('重写')
//   }
// }
// 测试 定义接口，类实现接口时可以增加新属性吗？ 答:可以增加自定义属性方法 但必须满足接口属性方法
// interface customClass {
//   name: string;
// }
// class test implements customClass {
//   name: string;
//   age: number;
//   constructor(a: string, b: number) {
//     this.name = a
//     this.age = b
//   }
//   fn(): void {
//     console.log(111)
//   }
// }
// 测试 定义私有属性
// class Person {
//   private name: string
//   private age: number
//   constructor(a: string, b: number) {
//     this.name = a
//     this.age = b
//   }
//   get(key: string) {
//     return this[key]
//   }
//   set(key: string, value: unknown) {
//     this[key] = value
//   }
// }
// let a = new Person('111', 222)
// console.log(a.get('name'))
// a.set('name', 'uuuu')
// console.log(a)
// 测试 TS存取器
// class Person {
//   private _name: string
//   private _age: number
//   constructor(a: string, b: number) {
//     this._name = a
//     this._age = b
//   }
//   get name() {
//     console.log('触发get')
//     return this._name
//   }
//   set name(value: string) {
//     console.log('触发set')
//     return
//     // this._name = value
//   }
// }
// let a = new Person('aaa', 111)
// a.name = 'bbb'
// console.log(a.name)
// 测试 protected关键字
// class A {
//   protected key: string;
//   constructor(a: string) {
//     this.key = a;
//   }
// }
// class B extends A {
//   fn() {
//     return this.key; // 子类中可以访问
//   }
// }
// let a = new A('a')
// a.key // 报错 不能访问
// let b = new B('b')
// b.key // 报错 同样不能访问
// 测试 语法糖定义类
// class A {
//   constructor(private _name: string, private _age: number) { }
//   get name() {
//     return this._name
//   }
//   set age(value: number) {
//     this._age = value
//   }
// }
// let a = new A('asdasd', 111)
// console.log(a.name, a.age)
// 测试 泛型指定跟数据实际类型不符会如何 答:报错
// function fn<aa>(p: aa): aa {
//   return p
// }
// fn<string>(10)
// 测试 多个泛型 答:泛型不能使用运算符
// function fn<aa, bb>(p1: bb, p2: aa): bb {
//   return p1 + p2
// }
// 测试 类语法糖public能否省略 答:不能
// class A {
//   constructor(public a: number, private b: number) { }
// }
// 测试 类中存取器是实例类型结构吗？ 答：是
// class A {
//   private _a: string = 'asd'
//   get aa() {
//     return this._a
//   }
// }
// let t: { _a: string } = new A()
// let t: { aaa: string } = new A()
// let t: { aa: string } = new A()
// 测试 类中声明并赋初值影响构造函数赋值吗 答:构造函数有参数时，创建实例不能不赋值，所以此时初始值没有意义
// class A {
//   aaa = 'aaa'
//   bbb = 2
//   constructor(a: string, b: number) {
//     this.aaa = a
//     this.bbb = b
//   }
// }
// let t = new A('asda', 1111)
// console.log(t)
// 测试 构造函数中可以设默认值吗？ 答:构造函数中不能用
// class A {
//   constructor(a: string = 'asd', b: number = 777) {
//     this.aaa = a
//     this.bbb = b
//   }
// }
// let t = new A('asda', 1111)
// console.log(t)
// 测试 ts函数中可以声明类型的同时设置参数默认值吗？ 答:可以
// function fn(a: string = 'asd'): void {
//   console.log(a)
// }
// fn()
// 测试 ES6类构造函数可以设置默认值吗？ 答:可以
// class A {
//   constructor(a = 10) {
//     this.a = a
//   }
// }
// let a = new A()
// console.log(a)
// 测试 类当作类型声明
var A = /** @class */ (function () {
    function A() {
    }
    // xxx: string // 普通方式可以
    // constructor(x: string) { // 使用构造函数也可以
    //   this.xxx = x
    // }
    // private xxx: string // 提示xxx是私有属性不能在类外使用
    // constructor(x: string) { // 有构造函数也不能在类外使用
    //   this.xxx = x
    // }
    // protected xxx: string // 提示xxx是被保护属性不能在类外使用
    // constructor(x: string) { // 有构造函数也不能在类外使用
    //   this.xxx = x
    // }
    // private xxx: string = 'asds' // 赋初值也不行，还是提示缺少属性
    A.xxx = 'asd';
    return A;
}());
var a = {
// xxx: 'asd'
};
