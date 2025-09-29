const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin'); // 引入插件

module.exports = {
	publicPath: '/',
	chainWebpack: (config) => {
		// 判断是否为小程序环境（mp-weixin、mp-alipay 等）
		const isMiniProgram = process.env.UNI_PLATFORM.includes('mp-');

		if (isMiniProgram) {
			// 为 uni-mp-loader 手动指定 babel-loader 路径
			config.module
				.rule('script')
				.use('babel-loader')
				.loader(require.resolve('babel-loader')) // 强制使用项目安装的 babel-loader
				.options({
					presets: [
						['@babel/preset-env', {
							targets: {
								chrome: '67',
								ios: '11'
							}, // 小程序兼容目标
							useBuiltIns: 'usage',
							corejs: 3
						}]
					]
				});
		}
		config.resolve.alias.set('path', path.resolve(__dirname, 'src/utils/mock-path.js'));
		// 强化全局变量模拟，覆盖路径相关变量
		config.plugin('define')
			.use(webpack.DefinePlugin, [{
				// 直接定义基础路径变量，阻止 Webpack 生成默认路径逻辑
				'process.env': JSON.stringify({
					NODE_ENV: process.env.NODE_ENV || 'development',
					VUE_APP_DEBUG: process.env.VUE_APP_DEBUG || false,
					VUE_APP_PLATFORM: process.env.VUE_APP_PLATFORM || 'h5',
					UNI_MP_PLUGIN_EXPORT: '{}'
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

		// 清除默认 SCSS 规则
		// config.module.rules.delete('scss');
		// config.module.rules.delete('sass'); // 同时清除 sass 规则避免冲突

		// 新建 SCSS 规则
		const scssRule = config.module.rule('scss')
		// .test(/\.scss$/)
		// // .exclude.add(path.resolve(__dirname, 'node_modules'))
		// .end();

		// 处理 Vue 单文件组件中的 SCSS (如 <style lang="scss">)
		scssRule.oneOf('vue-scss')
			.resourceQuery(/\?vue/)
			.use('vue-style-loader')
			.loader('vue-style-loader')
			.end()
			.use('css-loader')
			.loader('css-loader')
			.options({
				importLoaders: 2, // 增加为 2，因为后面有 postcss-loader 和 sass-loader
				sourceMap: process.env.NODE_ENV === 'development'
			})
			.end()
			.use('postcss-loader') // 新增 postcss 处理 autoprefixer 等
			.loader('postcss-loader')
			.options({
				sourceMap: process.env.NODE_ENV === 'development'
			})
			.end()
			.use('sass-loader')
			.loader('sass-loader')
			.options({
				sourceMap: process.env.NODE_ENV === 'development',
				// 可以添加全局 SCSS 变量文件
				// additionalData: `@import "@/styles/variables.scss";` // 路径根据实际项目调整
			})
			.end();

		// 处理普通 SCSS 文件 (如 import 'xxx.scss')
		scssRule.oneOf('normal-scss')
			.use('style-loader')
			.loader('style-loader')
			.end()
			.use('css-loader')
			.loader('css-loader')
			.options({
				importLoaders: 2,
				sourceMap: process.env.NODE_ENV === 'development'
			})
			.end()
			.use('postcss-loader')
			.loader('postcss-loader')
			.options({
				sourceMap: process.env.NODE_ENV === 'development'
			})
			.end()
			.use('sass-loader')
			.loader('sass-loader')
			.options({
				sourceMap: process.env.NODE_ENV === 'development',
				// additionalData: `@import "@/styles/variables.scss";`
			})
			.end();
		if (process.env.NODE_ENV === 'development') {
			const oneOfs = Array.from(scssRule.oneOfs.store);
			console.log('有效 SCSS 规则数量：', oneOfs.length);
			const loaderCount = oneOfs.reduce((total, oneOf) => {
				return total + (oneOf.use ? Array.from(oneOf.use.values()).length : 0);
			}, 0);
			console.log('每个 SCSS 规则分支的 loader 数量：', loaderCount);
		}
	},
	// 单独指定小程序端的 Webpack 配置
	configureWebpack: (config) => {
		if (process.env.UNI_PLATFORM.includes('mp-')) {
			// config.module.rules.push({
			// 	test: /\.js$/,
			// 	use: 'babel-loader',
			// 	exclude: /node_modules/
			// });
		}
	}
};