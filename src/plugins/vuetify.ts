import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.teal.lighten1,
        appbar: '#FFFFFF'
      },
      dark: {
        primary: colors.teal.lighten1,
        appbar: '#131313'
      }
    }
  }
})
