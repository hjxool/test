class Point {
  num x = 0;
  num y = 0;
  // 完整写法
  // Point(num x, num y) {
  //   this.x = x;
  //   this.y = y;
  // }

  // 构造函数简写
  // Point(this.x, this.y);

  // 测试 普通构造函数能用{key = value}作为形参默认值吗？ 答: 可以
  // Point({x = 11, y = 1}) {
  //   this.x = x;
  //   this.y = y;
  // }

  // 命名构造函数
  // Point.first(num x, num y) {
  //   this.x = x;
  //   this.y = y;
  // }

  // 测试 命名构造函数可以用简写形式吗？ 答: 可以
  // Point.first(this.x, this.y);

  // 测试 命名构造函数可以用{key: value}作为形参默认值吗？ 答: 新版不行，必须用=号
  // Point.second({x = 0, y = 0}) {}

  // 测试 命名构造函数和普通构造函数可以同时存在吗？ 答: 可以
  Point({int x = 1, int y = 3}) {
    this.x = x;
    this.y = y;
  }
  Point.fn1(int x, int y) {
    this.x = x;
    this.y = y;
  }
}

// 常量构造函数
class ImmutablePoint {
  // 测试 常量构造函数可以不使用final声明吗？ 答: 不行
  // num x = 1;
  // num y = 1;

  // 用final声明可以不用赋初值
  final num x;
  final num y;

  // 常量构造函数 必须通过 const 声明
  const ImmutablePoint(this.x, this.y);

  // 测试 常量构造函数是否可以写函数体？ 答: 不行
  // const ImmutablePoint(num x, num y) {
  //   this.x = x;
  //   this.y = y;
  // }
}

// 工厂函数 单例模式
class FactoryTest {
  String keyname = '';
  // static FactoryTest instance;

  static final Map instance = {};

  factory FactoryTest(String name) {
    return FactoryTest.instance
        .putIfAbsent('test', () => new FactoryTest.createInstance(name));
  }

  factory FactoryTest.createInstanceByJson(Map json) {
    return new FactoryTest(json['name'].toString());
  }

  FactoryTest.createInstance(this.keyname);
}

void main() {
  // 测试类传参
  // Point p = new Point(x: 4, y: 1);
  // print(p.x);

  // Point p2 = new Point.fn1(10, 5);
  // print(p2.x);

  // 测试 工厂构造函数
  var p = new FactoryTest('张三');
  print(p.keyname);
  var p2 = new FactoryTest('李四');
  print(p2.keyname);
  // var p3 = new FactoryTest('张三');
  // print(p3.keyname);
  // print('------------------------');
  // print(p == p2);
  // print(p == p3);
  // print('------------------------');
  // var p4 = new FactoryTest.createInstanceByJson({'name': '张三'});
  // print(p == p4);
}
