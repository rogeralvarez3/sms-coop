import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import {router} from './router'
import swal from 'vue-sweetalert2'


Vue.config.productionTip = false
Vue.use(swal)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

