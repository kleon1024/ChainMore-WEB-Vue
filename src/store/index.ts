import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { secureStorage } from '@/globals'
import { UserBean } from './modules/user'
import { PersonBean } from './modules/person'

Vue.use(Vuex)

export interface RootBean {
    user: UserBean
    person: PersonBean
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootBean>({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => secureStorage.get(key),
        setItem: (key, value) => secureStorage.set(key, value),
        removeItem: (key) => secureStorage.remove(key)
      }
    })
  ]
})
