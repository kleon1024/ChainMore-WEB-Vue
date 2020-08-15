import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { UserModule } from '@/store/modules/user'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Default',
    component: () => import(/* webpackChunkName: "default" */ '../views/Default.vue'),
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
    path: '/resource/:id',
    name: 'Resource',
    component: () => import(/* webpackChunkName: "resource" */ '../views/Resource.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/create/resource',
    name: 'ResourceCreate',
    component: () => import(/* webpackChunkName: "resource_create" */ '../views/ResourceCreate.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create/domain',
    name: 'DomainCreate',
    component: () => import(/* webpackChunkName: "domain_create" */ '../views/DomainCreate.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create/collection',
    name: 'CollectionCreate',
    component: () => import(/* webpackChunkName: "colletion_create" */ '../views/CollectionCreate.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/person',
    name: 'Person',
    component: () => import(/* webpackChunkName: "person" */ '../views/Person.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'resource',
        name: 'Person\'s Resource',
        component: () => import(/* webpackChunkName: "home" */ '../views/PersonalResource.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'collection',
        name: 'Person\'s Collection',
        component: () => import(/* webpackChunkName: "home" */ '../views/PersonalCollection.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'domain',
        name: 'Person\'s Domain',
        component: () => import(/* webpackChunkName: "home" */ '../views/PersonalDomain.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (UserModule.username === '' || UserModule.refreshToken === '') {
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
