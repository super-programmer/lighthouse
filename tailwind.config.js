/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,jsx,ts,tsx,vue}',
		'./src/pages/**/*.{html,js,jsx,ts,tsx,vue}',
		'./src/components/**/*.{html,js,jsx,ts,tsx,vue}',
		'./src/components/*.{html,js,jsx,ts,tsx,vue}'
	],
	theme: {
		extend: {},
	},
	plugins: [],
	corePlugins: {
		// preflight: true, // 禁用preflight插件，它会处理很多如margin、padding重置等基础样式，禁用它可去除大量基础样式
		// 还可以根据需要继续禁用其他涉及基础样式生成的核心插件，比如：
		// container: false, // 禁用和容器相关的基础样式（如果有）
	},
}