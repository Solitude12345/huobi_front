import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/element-ui-overide.css'
import '../src/assets/global.css'

import '@/axios'
import './assets/js/vueExtend'
import './assets/js/globalComponents'

import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
