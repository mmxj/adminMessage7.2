// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueQuillEditor from 'vue-quill-editor'
import router from './router'
import axios from 'axios'
import '../theme/index.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icon/iconfont.css';
import store from './store'
import $ from 'jquery'
// import '@/assets/js/jquery.1.11.1.min.js'
import '@/assets/js/jquery.md5.js'
import '@/assets/js/jquery.form.min.js'


// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import '@/assets/js/xlsx.full.min.js'
import '@/assets/css/index.css'

// import '@/assets/js/xlsx.full.min.js'
// import xlsx from 'js-xlsx'
//处理上传表格组件

//地址组件
import Distpicker from 'v-distpicker'

//高德地图vue-amap;
import VueAMap from 'vue-amap'

Vue.component('v-distpicker', Distpicker)
Vue.use(ElementUI);

Vue.use(VueQuillEditor)

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key:'198f927638a9991bf8309e3e2962a98e',
  plugin:['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','Geocoder'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
