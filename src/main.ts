import Vue from 'vue'
import App from './App.vue'
import './uni.promisify.adaptor'
// 组件注册
Vue.config.productionTip = false
Vue.prototype.BASE_URL = process.env.BASE_URL
Vue.prototype.VUE_APP_INDEX_CSS_HASH = process.env.VUE_APP_INDEX_CSS_HASH
const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app' }, App)))
app.$mount();