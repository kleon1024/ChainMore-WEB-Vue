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
      requiresAuth: false,
      title: '阡陌'
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
      requiresAuth: false,
      title: '关于 - 阡陌'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      requiresAuth: false,
      title: '登录 - 阡陌'
    }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import(/* webpackChunkName: "password" */ '../views/ChangePassword.vue'),
    meta: {
      requiresAuth: false,
      title: '修改密码 - 阡陌'
    }
  },
  {
    path: '/op/:operation/resource',
    name: 'ResourceCreate',
    component: () => import(/* webpackChunkName: "resource_create" */ '../views/ResourceCreate.vue'),
    meta: {
      requiresAuth: true,
      title: '添加资源 - 阡陌'
    }
  },
  {
    path: '/op/:operation/domain',
    name: 'DomainCreate',
    component: () => import(/* webpackChunkName: "domain_create" */ '../views/DomainCreate.vue'),
    meta: {
      requiresAuth: true,
      title: '创建领域 - 阡陌'
    }
  },
  {
    path: '/op/:operation/collection',
    name: 'CollectionCreate',
    component: () => import(/* webpackChunkName: "colletion_create" */ '../views/CollectionCreate.vue'),
    meta: {
      requiresAuth: true,
      title: '发布合集 - 阡陌'
    }
  },
  {
    path: '/certify',
    name: 'Certify',
    component: () => import(/* webpackChunkName: "certify" */ '../views/Certify.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/certify/group/:id',
    name: 'Certify Group',
    component: () => import(/* webpackChunkName: "certify-group" */ '../views/CertifyGroup.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import(/* webpackChunkName: "group-explore" */ '../views/Explore.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "group-explore" */ '../views/Domain.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'roadmap',
        name: 'Roadmap',
        component: () => import(/* webpackChunkName: "group-explore" */ '../views/Roadmap.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'domain/:id',
        name: 'Domain',
        component: () => import(/* webpackChunkName: "group-explore" */ '../views/Domain.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'collection/:id',
        name: 'Collection',
        component: () => import(/* webpackChunkName: "group-explore" */ '../views/Collection.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'resource/:id',
        name: 'Resource',
        component: () => import(/* webpackChunkName: "group-explore" */ '../views/Resource.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/member',
        name: 'Member',
        component: () => import(/* webpackChunkName: "group-explore" */ '../views/Member.vue'),
        meta: {
          requiresAuth: false,
          title: '会员'
        }
      }
    ]
  },
  {
    path: '/person',
    name: 'Person',
    component: () => import(/* webpackChunkName: "group-person" */ '../views/Person.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/Home.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'resource',
        name: 'Person\'s Resource',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalResource.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'collection',
        name: 'Person\'s Collection',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalCollection.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'domain',
        name: 'Person\'s Domain',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalDomain.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'manage/domain/:id',
        name: 'Manage Domain',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/ManageDomain.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'learn/domain/:id',
        name: 'Learn Domain',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/LearnDomain.vue'),
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
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (process.env.NODE_ENV !== 'production') {
    next()
    return
  }
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
