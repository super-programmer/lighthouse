/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,jsx,ts,tsx,vue}',
		'./src/pages/**/*.{html,js,jsx,ts,tsx,vue}',
		'./src/components/**/*.{html,js,jsx,ts,tsx,vue}',
		'./src/components/*.{html,js,jsx,ts,tsx,vue}'
	],
	corePlugins: {
		// 移除通配符重置样式
		preflight: false,
		// 移除小程序不支持的选择器相关插件
		container: false,
		space: false,
	},
	// 自定义工具类（可选）
	plugins: [],
	// 生成兼容小程序的输出格式
	output: {
		// 避免生成带 `*` 的选择器
		minimize: true,
	},
	theme: {
		// 自定义工具类的分隔符（避免使用 /）
		separator: '-',
	},
	// 配置插件避免转义
	experimental: {
		// 禁用分数的自动转义
		escapeHatch: true,
	},
}