import Vue from 'vue'
import { isH5, isWeixin } from '@/utils/platform';

// 挂载平台判断工具到 Vue 原型
Vue.prototype.$isH5 = isH5
Vue.prototype.$isWeixin = isWeixin