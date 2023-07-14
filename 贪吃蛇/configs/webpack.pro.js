const path = require('path');
const css = require('mini-css-extract-plugin');
const html = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: path.resolve(__dirname, '../src/main.ts'), //入口是ts
	output: {
		path: path.resolve(__dirname, '../bundle'),
		filename: 'js/[name].js', //生成浏览器可识别的js文件
		clean: true,
	},
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
	devtool: 'source-map',
};
