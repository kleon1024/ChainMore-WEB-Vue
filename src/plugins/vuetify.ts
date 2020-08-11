import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#009688',
        secondary: '#009688',
        accent: '#009688',
        error: '#b71c1c'
      }
    }
  }
})
