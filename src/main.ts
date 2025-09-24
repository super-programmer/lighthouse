import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import FontAwesomeIcon from './components/FontAwsomeIcon.vue'
// import 'uni.scss';
import '../dist/output.css'

// 检查是否有间接引入的 Font Awesome CSS
console.warn('请确保没有引入 @fortawesome/fontawesome-free/css/* 相关文件，这些文件依赖浏览器环境');

// 按需引入需要的图标
import { 
  faHome, 
  faUser, 
  faSearch, 
  faShoppingCart,
  faBullhorn,    // 新增
  faPencilAlt,   // 新增
  faUniversity,  // 新增
  faBookOpen,    // 新增
  faLightbulb,   // 新增
  faChartLine,   // 新增
  faAngleRight   // 新增
} from '@fortawesome/free-solid-svg-icons'

// 将需要使用的图标添加到库中
library.add(
  faHome, 
  faUser, 
  faSearch, 
  faShoppingCart,
  faBullhorn,
  faPencilAlt,
  faUniversity,
  faBookOpen,
  faLightbulb,
  faChartLine,
  faAngleRight
)

// 全局注册 FontAwesomeIcon 组件
Vue.component('font-awesome-icon', FontAwesomeIcon)
// 引入平台判断工具（确保路径正确）
import { isH5, isWeixin } from '@/utils/platform';

// 挂载到 Vue 原型，全局可用
Vue.prototype.$isH5 = isH5
Vue.prototype.$isWeixin = isWeixin 
Vue.config.productionTip = false

new Vue({
	render: h => h(App)
}).$mount('#app')