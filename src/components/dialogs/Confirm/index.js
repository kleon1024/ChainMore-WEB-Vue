import Confirm from './Confirm.vue'
import Vuetify from 'vuetify/lib'

function Install (Vue, options = {}) {
  const property = options.property || '$confirm'
  delete options.property
  let vuetify = options.vuetify
  delete options.vuetify
  if (!vuetify) {
    vuetify = new Vuetify()
  }
  const Ctor = Vue.extend(Object.assign({ vuetify }, Confirm))
  function createDialogCmp (options) {
    const container = document.querySelector('[data-app=true]') || document.body
    return new Promise(resolve => {
      const cmp = new Ctor(Object.assign({}, {
        propsData: Object.assign({}, Vue.prototype[property].options, options),
        destroyed: () => {
          container.removeChild(cmp.$el)
          resolve(cmp.value)
        }
      }))
      container.appendChild(cmp.$mount().$el)
    })
  }

  function show (message, options = {}) {
    options.message = message
    return createDialogCmp(options)
  }

  Vue.prototype[property] = show
  Vue.prototype[property].options = options || {}
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Install)
}

export default Install
