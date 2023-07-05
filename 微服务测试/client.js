// 1.引入proto文件
let grpc = require('@grpc/grpc-js');
let protoloader = require('@grpc/proto-loader');
const path = require('path');
let proto_path = path.resolve(__dirname + '/protos/greeter.proto');

// 2.解析proto文件 固定写法
let package_definition = protoloader.loadSync(proto_path, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});
// test1是在.proto文件中定义的包名
let proto_obj = grpc.loadPackageDefinition(package_definition).test1;

// 3.建立连接
// 参数：地址及端口 通信凭证
// 注：通信凭证与服务端不同
let client = new proto_obj.Greeter('127.0.0.1:3001', grpc.credentials.createInsecure());
// 调用方法 参数必须对应.proto的message生成结果 对象中属性可以不写 但不能写错 会接收不到
// 参数：错误信息 响应体数据
client.fn1({ name: '张三', age: 22, sex: '男', flag: true }, (err, res) => {
	console.log(res);
});
