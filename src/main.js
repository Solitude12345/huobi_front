import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/element-ui-overide.css'
import '../src/assets/global.css'

import Vue from 'vue'
import './axios'
import store from './store'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// import wsBus from './assets/js/wsBus'
import '@/assets/js/filters'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
