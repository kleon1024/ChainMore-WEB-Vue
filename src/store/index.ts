import Vue from 'vue'
import Vuex from 'vuex'
import { UserBean } from './modules/user'

Vue.use(Vuex)

export interface RootBean {
    user: UserBean
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootBean>({})
