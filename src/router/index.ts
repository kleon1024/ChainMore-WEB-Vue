import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import { UserModule } from '@/store/modules/user'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/domain/:id',
    name: 'Domain',
    component: () => import(/* webpackChunkName: "domain" */ '../views/Domain.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/collection/:id',
    name: 'Collection',
    component: () => import(/* webpackChunkName: "collection" */ '../views/Collection.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/person',
    name: 'Person',
    component: () => import(/* webpackChunkName: "person" */ '../views/Person.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (UserModule.username === '' && UserModule.refreshToken === '') {
      next({
        path: '/login',
        query: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
