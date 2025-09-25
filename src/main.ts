import Vue from 'vue'
import App from './App.vue'

import 'uni.scss';
import '../dist/output.css'
// 导入并应用组件注册
import './plugins/index'
// 导入并应用平台工具
import './plugins/platform'
Vue.config.productionTip = false

new Vue({
	render: h => h(App)
}).$mount('#app')