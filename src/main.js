import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import axios from '@/utils/request'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import moment from 'moment'
import 'moment/locale/zh-cn'
import BaiduMap from 'vue-baidu-map' // 引入百度地图组件
import '@/icons' // icon
import '@/permission' // permission control
import Pagination from './components/Pagination/index'
import UploadFile from './components/Upload/index'
import ImagePreview from './components/ImagePreview/index'
import _ from 'lodash'
import 'font-awesome/css/font-awesome.min.css'
import WorkFlow from '@zgeaw/work-flow' // 工作流组件
import '@zgeaw/work-flow/dist/WorkFlow.css'
Vue.use(WorkFlow)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

/**
 * 设定全局element 组件为small size
 * **/
Vue.use(ElementUI, { size: 'small' })
Vue.prototype.$urlSuffix = process.env.VUE_APP_BASE_API // 环境变量
Vue.use(VueClipboard)
Vue.component('Pagination', Pagination)
Vue.component('UploadFile', UploadFile)
Vue.component('ImagePreview', ImagePreview)
Vue.use(BaiduMap, {
  ak: 'E3d49U4ohTx2bANAkfzqAGimmzn7dbex' // 使用申请的百度地图秘钥
})
Vue.prototype._ = _
moment.locale('zh-cn')
Vue.prototype.moment = moment
Vue.prototype.axios = axios
window.moment = moment

Vue.config.productionTip = false

/*
获取系统参数分组数据
group 分组参数
this.$getArgList(group)
*/
const getLabel = (options, value) => _.get(_.find(options, { value }), 'label', '-')
Vue.prototype.$getLabel = getLabel
Vue.prototype.$getArgList = group =>
  store.state.user.config[group] && store.state.user.config[group].children.filter(item => !item.deleteFlag)
/*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */
Vue.prototype.$getLabelFromArg = (group, value) =>
  getLabel(store.state.user.config[group] && store.state.user.config[group].children, value + '')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
