import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Toasted from 'vue-toasted'
import VuetifyConfirm from 'vuetify-confirm'

Vue.use(VuetifyConfirm, { vuetify })

Vue.use(Toasted)

Vue.config.productionTip = false
Vue.config.devtools = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
