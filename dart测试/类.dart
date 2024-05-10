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

void main() {
  // 测试类传参
  Point p = new Point(x: 4, y: 1);
  print(p.x);

  Point p2 = new Point.fn1(10, 5);
  print(p2.x);
}
