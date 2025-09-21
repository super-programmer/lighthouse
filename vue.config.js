const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin'); // 引入插件

module.exports = {
	publicPath: '/',

	chainWebpack: (config) => {
		config.resolve.alias.set('path', path.resolve(__dirname, 'src/utils/mock-path.js'));
		// 强化全局变量模拟，覆盖路径相关变量
		config.plugin('define')
			.use(webpack.DefinePlugin, [{
				// 直接定义基础路径变量，阻止 Webpack 生成默认路径逻辑
				'process.env': JSON.stringify({
					NODE_ENV: process.env.NODE_ENV || 'development',
					VUE_APP_DEBUG: process.env.VUE_APP_DEBUG || false,
					VUE_APP_PLATFORM: process.env.VUE_APP_PLATFORM || 'h5'
					// 其他需要的环境变量
				}),
				// 确保 process 变量本身被定义（避免直接引用 process 时出错）
				'process': '{"env": ' + JSON.stringify(process.env) + '}'
			}]);

		// 配置全局对象为小程序支持的 this
		// config.output
			// .globalObject('this');
		config.optimization.minimizer('terser').use(TerserPlugin, [{
			terserOptions: {
				output: {
					// 移除特定代码行
					preamble: (content) => {
						// 使用正则精确匹配目标代码
						const regex =
							/__webpack_require__\.b = document\.baseURI \|\| self\.location\.href;/;
						return content.replace(regex, '');
					},
					comments: false // 可选：移除所有注释
				},
				// 其他压缩配置保持默认
				compress: {
					drop_console: true, // 可选：移除 console
					drop_debugger: true
				}
			}
		}]);

		// 原有 SCSS 规则配置（保持不变）
		config.module.rules.delete('scss');
		const scssRule = config.module.rule('scss')
			.test(/\.scss$/)
			.exclude.add(path.resolve(__dirname, 'node_modules'))
			.end();

		scssRule.oneOf('vue-scss')
			.resourceQuery(/\?vue/)
			.use('vue-style-loader')
			.loader('vue-style-loader')
			.end()
			.use('css-loader')
			.loader('css-loader')
			.options({
				importLoaders: 1
			})
			.end()
			.use('sass-loader')
			.loader('sass-loader')
			.options({
				sourceMap: process.env.NODE_ENV === 'development'
			})
			.end();

		scssRule.oneOf('normal-scss')
			.use('style-loader')
			.loader('style-loader')
			.end()
			.use('css-loader')
			.loader('css-loader')
			.options({
				importLoaders: 1
			})
			.end()
			.use('sass-loader')
			.loader('sass-loader')
			.options({
				sourceMap: process.env.NODE_ENV === 'development'
			})
			.end();
		// 添加字体文件处理规则
		config.module
			.rule('fonts')
			.test(/\.(woff2?|eot|ttf|otf)$/i)
			.exclude.add(/@fortawesome/) // 排除 Font Awesome 的字体文件
			.end();
		if (process.env.NODE_ENV === 'development') {
			const oneOfs = Array.from(scssRule.oneOfs.store);
			console.log('有效 SCSS 规则数量：', oneOfs.length);
			const loaderCount = oneOfs.reduce((total, oneOf) => {
				return total + (oneOf.use ? Array.from(oneOf.use.values()).length : 0);
			}, 0);
			console.log('每个 SCSS 规则分支的 loader 数量：', loaderCount);
		}
	}
};