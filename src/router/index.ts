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
    path: '/op/:operation/group',
    name: 'DomainCreate',
    component: () => import(/* webpackChunkName: "group_create" */ '../views/GroupCreate.vue'),
    meta: {
      requiresAuth: true,
      title: '创建团队 - 阡陌'
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
          title: '个人中心 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'resource',
        name: 'Person\'s Resource',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalResource.vue'),
        meta: {
          title: '收藏资源 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'collection',
        name: 'Person\'s Collection',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalCollection.vue'),
        meta: {
          title: '收藏集合 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'domain',
        name: 'Person\'s Domain',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalDomain.vue'),
        meta: {
          title: '收藏领域 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'action',
        name: 'Person\'s Action',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/PersonalAction.vue'),
        meta: {
          title: '行动计划 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'manage/domain/:id',
        name: 'Manage Domain',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/ManageDomain.vue'),
        meta: {
          title: '领域管理 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'learn/domain/:id',
        name: 'Learn Domain',
        component: () => import(/* webpackChunkName: "group-person" */ '../views/LearnDomain.vue'),
        meta: {
          title: '正在学习 - 阡陌',
          requiresAuth: true
        }
      },
      {
        path: 'group/:id',
        name: 'Group',
        component: () => import(/* webpackChunkName: "group-group" */ '../views/Group.vue'),
        meta: {
          title: '团队管理 - 阡陌',
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
