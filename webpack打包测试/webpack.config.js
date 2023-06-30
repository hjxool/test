const path = require('path');
// 必须使用nodeJS的模块化语法 毕竟压缩的是ES语法，不可能再用ES模块化语法
module.exports = {
	// 模式
	mode: 'development',
	// 入口 必须用 相对路径
	entry: './main.js',
	// 输出
	output: {
		// 文件的输出路径 必须用 绝对路径
		path: path.join(__dirname, 'bundle'),
		// 文件名
		filename: 'js/test.js', // 也可以指定目录
	},
	// 加载器
	module: {
		// loader的配置
		rules: [
			{
				test: /\.css/i, // 只检测.css(忽略大小写)文件
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.less/i,
				use: ['style-loader', 'css-loader', 'less-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|webp|svg)$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
				generator: {
					// 输出文件名及目录
					filename: 'img/[hash][ext][query]',
				},
			},
		],
	},
	// 插件 数组
	plugins: [],
};
