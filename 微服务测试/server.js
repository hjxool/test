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

// 3.定义远程调用方法 函数名必须跟.proto文件中 rpc定义的方法名 统一
function fn1(req, res) {
	console.log(req);
	res(null, { code: 200, message: '测试成功', result: 'test server' });
}

// 4.启动服务
// 创建实例对象
let server = new grpc.Server();
// 注册服务 service是固定写法 第二个参数是调用方法 可以传入多个
server.addService(proto_obj.Greeter.service, { fn1 });
// 监听端口
// 参数：地址及端口 通信凭证 回调函数
// 地址可以填'0.0.0.0'表示任意地址
server.bindAsync('127.0.0.1:3001', grpc.ServerCredentials.createInsecure(), () => {
	server.start();
	console.log('监听3001端口...');
});
