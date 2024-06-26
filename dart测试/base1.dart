import 'dart:math';

main() {
  // print('test1');

  // 不明确类型
  // 未赋初值时是否可以随时改变值 答：可以
  // var a;
  // a = 1;
  // print(a);
  // a = 'asd';
  // print(a);
  // 赋了初始值还能改吗 答：不行
  // var a = 1;
  // print(a);
  // a = 'asd';
  // print(a);

  // 数字类型API
  // num n1 = -3.7;
  // print(n1.ceil());
  // 转换成整数
  // print(5.5.toInt());
  // 四舍五入
  // print(-3.7.round());

  // 常量可以和动态类型一起使用吗？ 答: 不可以和var，但可以和dynamic
  // final var x = 1;
  // final num x = 1;
  // final dynamic x = 1;

  // dynamic 声明的动态类型 可以随时改值吗？ 答: 可以
  // dynamic x = 1;
  // x = 'asd';
  // var y = 1;
  // y = 'sad';
  // dynamic z;
  // z = 1;
  // z = 'asd';

  // 字符串类型
  // String str = '''
  // Hello
  // World
  // ''';
  // print(str);
  // String str2 = '你好';
  // 字符串拼接
  // print(str + str2);
  // print('$str2 $str');
  // 字符串分隔
  // print(str2.split(''));
  // print('qwe'.split(''));
  // 判断字符串是否为空
  // print(' '.isEmpty);
  // 字符串替换
  // print(str2.replaceAll('好', 'hello'));
  // String str3 = 'ssss';
  // print(str3.replaceAll('s', 'hello'));

  // 正则
  // var p = RegExp(r'\d+');
  // var p2 = RegExp(r'\\d+'); // 没有\\的用法
  // var str = 'abc123ttt';
  // print(str.split(p));
  // print(str.split(p2));

  // dart中是否有===
  // var t1 = 'aaa';
  // var t2 = 'aaa';
  // print(t1 == t2); // true
  // print(t1 === t2); // 没有===号

  // 数组
  // List arr = <int>[1, 2, 3, 4];
  // print(arr);
  // var arr;
  // List arr2 = [...?arr];
  // print(arr2);
  // 数组反转
  // List arr = [1, 2, 3];
  // print(arr.reversed);
  // print(arr.reversed.toList(growable: true));
  // dart数组反转后 是否改变原数组？ 答：不改变
  // arr.reversed;
  // print(arr);
  // 数组添加元素
  // arr.addAll([4, 5, 4]);
  // print(arr);
  // 删除元素 只会删除第一个匹配到的元素
  // arr.remove(4);
  // print(arr);

  // for in测试 不同于JS 取值不是下标了
  // var a = ['a', 'b'];
  // for (var item in a) {
  //   print(item);
  // }

  // forEach测试
  // var a = ['a', 'b'];
  // a.forEach((element) {
  //   print(element);
  // });

  // map测试
  // var a = [1, 2, 3];
  // var b = a.map((e) {
  //   return e + 1;
  // });
  // print(b);
  // var b = a.map((e) => e + 1);
  // print(b);
  // var b = a.map((e) {
  //   if (e == 1) {
  //     return e + 1;
  //   } else {
  //     return e + 2;
  //   }
  // });
  // print(b);

  // any测试
  // var arr = [1, 2, 3];
  // print(arr.any((e) => e == 2));

  // expand测试
  // var arr = [
  //   [1, 2],
  //   [3, 4]
  // ];
  // arr.expand((element) {
  //   print(element);
  //   return element;
  // });

  // fold 测试
  // var arr = [1, 2, 3];
  // var r = arr.fold(2, (previousValue, element) => previousValue * element);
  // print(r);

  // 数组转Set集合
  // List arr = [1, 2, 3];
  // print(arr.toSet());

  // set有length属性吗？ 答：有
  // print(arr.toSet().length); // 3

  // set集合求交集
  // var arr = [1, 2, 3];
  // var set1 = arr.toSet();
  // arr = [2, 3, 7];
  // var set2 = arr.toSet();
  // print(set1.intersection(set2));

  // map测试
  // var map = {'name': 'sasd', 'age': 18};
  // print(map);

  // map 测试length
  // print(map.length); // 2

  // map 判断key是否存在
  // print(map.containsKey('name'));
  // print(map.containsValue(18));

  // map 测试赋值重复的key 答：会覆盖同名键值
  // map['name'] = 'xxx';
  // print(map);

  // map 测试取值
  // print(map['name']);

  // 避空运算符 测试
  // print(null ?? 1); // 1
  // print(null ?? null ?? 1); // 1

  // 避空运算符 0是否算空 答：不算
  // 且会警告
  // print(0 ?? 1); // 0

  // 避空运算符 赋值操作
  // var a;
  // a ??= 3;
  // print(a); // 3

  // 函数有声明提升吗 答：没有
  // fn();
  // void fn() {
  //   print(1);
  // }

  // 函数 不使用可选参数，也需要设置默认值吗？ 答:指定类型的才需要设置默认值
  // String fn(String name, [var age]) {
  //   return '你好: $name, 年龄: $age';
  // }

  // print(fn('张三'));

  // 函数 用var声明的可选参数 传入不同类型参数会报错吗？ 答:不会
  // String fn(String name, [var age = 12]) {
  //   return '你好: $name, 年龄: $age';
  // }

  // print(fn('张三', 18));
  // print(fn('张三', '78'));

  // 命名参数 测试 可以不用写类型吗？ 答: 可以，相当于var声明
  // String fn({name}) {
  //   return '你好: $name';
  // }

  // print(fn(name: 'asd'));

  // 命名参数 测试 不指定类型，并赋初值后，还可以传入不同类型参数吗？
  // 答: 可以
  // String fn({name = 'ssss'}) {
  //   return '你好: $name';
  // }

  // print(fn(name: 123));

  // 测试 final 和 const 声明需要赋初值吗？ 答: const必须赋初值，final不需要
  // final x;
  // const y;

  // 测试 final声明后可以修改值吗？
  // 答: 不论赋不赋初值，final声明的常量在赋值过后都不能再修改
  // final x;
  // x = 1;
  // x = 22;
}
