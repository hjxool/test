const path = require('path');
const css = require('mini-css-extract-plugin');
const html = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: path.resolve(__dirname, '../src/main.ts'),
	// output不能少
	output: {
		path: undefined, // 没有路径 因为是在内存编译
		filename: 'js/[name].js', // 文件名还是需要指定
	},
	// 其他配置相同
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.css$/,
						use: [css.loader, 'css-loader'],
						include: path.resolve(__dirname, '../src'),
					},
					{
						test: /\.ts$/,
						use: [
							{
								loader: 'ts-loader',
								options: {
									configFile: path.resolve(__dirname, './tsconfig.json'),
								},
							},
						],
						include: path.resolve(__dirname, '../src'),
					},
				],
			},
		],
	},
	plugins: [
		new css({
			filename: 'css/index.css',
		}),
		new html({
			template: path.resolve(__dirname, '../src/index.html'),
			filename: 'html/index.html', //测试下html能否自动生成名字
		}),
	],
	devtool: 'cheap-module-source-map',
	devServer: {
		host: 'localhost', // 启动服务器域名
		port: '30', // 启动服务器端口号
		open: true, // 是否自动打开浏览器
	},
};
