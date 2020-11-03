import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Toasted from 'vue-toasted'
import Marked from './directives/marked.js'
import VuetifyConfirm from './components/dialogs/Confirm'
import VueVirtualScoller from 'vue-virtual-scroller'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll)
Vue.use(VueVirtualScoller)
Vue.use(Marked)
Vue.use(VuetifyConfirm, { vuetify })
Vue.use(Toasted, {
  theme: 'outline',
  position: 'top-center',
  duration: 2000
})

Vue.config.productionTip = false
Vue.config.devtools = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
