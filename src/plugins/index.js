import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import FontAwesomeIcon from '../components/FontAwesomeIcon.vue'
FontAwesomeIcon

// 按需引入需要的图标
import { 
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
} from '@fortawesome/free-solid-svg-icons'

// 注册图标
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

// 全局注册组件
// Vue.component('font-awesome-icon', FontAwesomeIcon)
