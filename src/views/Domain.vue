<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      right
    >
      <v-stepper
        v-if="isLoggedIn"
        vertical
        v-model="step"
        class="elevation-0"
      >
        <template v-for="(domain, index) in dependDomains">
          <v-stepper-step
            :key="`${index}-step`"
            :complete="domain.certified"
            :step="index"
          >
            {{ domain.title }}
          </v-stepper-step>
        </template>
      </v-stepper>
      <v-container>
        <v-btn
          v-if="isLoggedIn"
          block
          outlined
          color="primary"
          @click="onClickStartToStudy"
        > 开始学习 </v-btn>
      </v-container>
      <v-container
        fill-height
        v-if="!isLoggedIn"
      >
        <v-card
          elevation="0"
          color="transparent"
        >
          <v-card-text>
            <v-col align="center">
              <v-icon size="36"> mdi-lock </v-icon>
            </v-col>
            <v-col align="center">
              <div> 定制学习路线 </div>
            </v-col>
          </v-card-text>
          <v-col align="center">
            <v-btn
              block
              outlined
              color="primary"
              :to="{path: '/login', query: { nextUrl: $route.path}}"
            > 立即登录 </v-btn>
          </v-col>
        </v-card>
      </v-container>
      <!-- <v-card elevation="0">
        <v-card-actions>
          <v-btn block outlined color="primary"> 开始学习 </v-btn>
        </v-card-actions>
      </v-card> -->
    </v-navigation-drawer>
    <v-skeleton-loader
      v-if="!domain"
      v-bind="attrs"
      type="card, actions"
    ></v-skeleton-loader>
    <v-card
      v-if="domain"
    >
      <v-card-text>
        <div class="caption">
          <span class="pr-2"> 领域 </span>
          <span v-for="(agg, i) in aggregatorDomains" :key="agg.title">
            <a :href="agg.href" v-if="!agg.disabled"> {{ agg.text }} </a>
            <span v-if="agg.disabled"> {{ agg.text }} </span>
            <v-icon class="caption" v-if="i < aggregatorDomains.length - 1"> mdi-chevron-right </v-icon>
          </span>
        </div>
        <div class='title font-weight-bold text--primary'>{{ domain.title }}</div>
        <div
          v-if="domain.intro != ''"
          class='subtile-2 text--primary'
          style='white-space: pre-wrap;'
        >{{ domain.intro }}</div>
        <div class="caption"> {{ readableTime(domain.create_time) }} 创建 </div>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              text
              @click="onClickMark"
            >
              <v-icon
                left
                :color='loginColor()'
              > {{ loginIcon() }} </v-icon>
              {{ loginIndicator() }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              text
              @click="drawer = !drawer"
            >
              <v-icon
                left
                color="teal"
              > mdi-transit-connection-variant </v-icon>
              学习路线
            </v-btn>
          </v-col>
          <v-col v-if="isModifiable">
            <v-btn
              text
              :to="{ path: '/op/modify/domain', query: { id: domain.id }}"
            >
              <v-icon
                left
                color="teal"
              > mdi-pencil-outline </v-icon>
              修改领域
            </v-btn>
          </v-col>
          <v-col v-if="marked">
            <v-btn
              text
              :to="{ path: '/op/create/collection', query: { domain: domain.id }}"
            >
              <v-icon
                left
                color="teal"
              > mdi-playlist-plus </v-icon>
              创建合集
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              text
              :to="{ path: '/certify', query: { domain: domain.id }}"
            >
              <v-icon
                left
                color="teal"
              > mdi-certificate-outline </v-icon>
              获得认证
            </v-btn>
          </v-col>
          <v-col v-if="isModifiable">
            <v-btn
              text
              :to="{ path: '/person/manage/domain/' + domain.id }"
            >
              <v-icon
                left
                color="teal"
              > mdi-palette-outline </v-icon>
              领域管理
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-card
      style='margin-top:10px'
      color="transparent"
      elevation="0"
    >
      <v-menu v-model="showMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
            left
          >
            <v-icon> mdi-chevron-down </v-icon>
            {{ orderDesc }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(opt, index) in orderOptions"
            :key="index"
            @click="refresh(opt.order, opt.desc)"
          >
            <v-list-item-content class="subtitle-2">{{ opt.desc }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>
    <div
      v-infinite-scroll="loadCollections"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    >
      <v-card
        v-for='(collection, index) in collections'
        :key='index'
        class='mb-2'
        :to="{ path: '/explore/collection/' + collection.id.toString() }"
      >
        <v-card-text>
          <div class='caption text--primary'> {{ collection.domain_title }}</div>
          <div class='subtitle-1 text--primary'>{{ collection.title }}</div>
          <div class='subtitle-2 text--primary'>{{ collection.description }}</div>
          <div class="caption text--primary"> {{ readableTime(collection.modify_time) }} 修改 </div>
        </v-card-text>
      </v-card>
      <div class="text-center">
        <v-progress-circular
          v-if="busy & !done"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </div>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  getDomainCollections,
  getDomain,
  isMarkDomain,
  markDomain,
  unmarkDomain,
  getDependedDomains,
  checkCertify,
  learn,
  getAggregatorDomains
} from '@/api/domains'
import { UserModule } from '@/store/modules/user'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'Domain',
  data() {
    return {
      busy: false,
      done: false,
      offset: 1,
      limit: 10,
      collections: [],
      domain: null,
      showMenu: false,
      certified: false,
      step: 0,
      orderOptions: [
        {
          order: 'time_desc',
          desc: '最新'
        },
        { order: 'time_asc', desc: '最早' }
      ],
      orderDesc: '最新',
      order: 'time_desc',
      starIcon: 'star_border',
      marked: false,
      marking: false,
      drawer: false,
      dependDomains: [],
      aggregatorDomains: []
    }
  },
  mounted() {
    this.loadCollections()
    this.loadDomain()
    this.checkMark()
    this.loadDependDomains()
    this.loadAggregatorDomains()
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    checkComplete() {
      return this.step > 1
    },
    onClickMark() {
      if (UserModule.isLoggedIn) {
        if (!this.marking) {
          this.marking = true
          if (this.marked) {
            unmarkDomain({ id: this.$route.params.id }).then((res) => {
              if (res.items.length === 1) {
                this.marked = false
              }
              this.marking = false
            })
          } else {
            markDomain({ id: this.$route.params.id }).then((res) => {
              if (res.items.length === 1) {
                this.marked = true
              }
              this.marking = false
            })
          }
        }
      } else {
        this.$router.push({
          path: '/login',
          query: { nextUrl: this.$route.path }
        })
      }
    },
    loginColor() {
      if (UserModule.isLoggedIn && this.marked) {
        return 'teal'
      } else {
        return 'grey'
      }
    },
    loginIndicator() {
      if (UserModule.isLoggedIn && this.marked) {
        return '已收藏'
      } else {
        return '收藏'
      }
    },
    loginIcon() {
      if (UserModule.isLoggedIn && this.marked) {
        return 'mdi-star'
      } else {
        return 'mdi-star-outline'
      }
    },
    checkMark() {
      if (UserModule.isLoggedIn) {
        isMarkDomain({ id: this.$route.params.id }).then((res) => {
          if (res.items.length === 1) {
            this.marked = true
          } else {
            this.marked = false
          }
        })
      }
    },
    refresh(order, orderDesc) {
      this.order = order
      this.orderDesc = orderDesc
      this.offset = 0
      this.loadCollections()
    },
    loadDependDomains() {
      if (UserModule.isLoggedIn) {
        getDependedDomains({ id: this.$route.params.id, distance: 999 }).then(
          (res) => {
            this.dependDomains.splice(0, this.dependDomains.length)
            this.dependDomains.push(...res.items)
          }
        )
      }
    },
    loadAggregatorDomains() {
      getAggregatorDomains({ id: this.$route.params.id, distance: 999 }).then(res => {
        this.aggregatorDomains.splice(0, this.aggregatorDomains.length)
        for (let i = 0; i < res.items.length; i++) {
          const domain = res.items[i]
          this.aggregatorDomains.push({
            text: domain.title,
            disabled: domain.id === this.$route.params.id,
            href: '/explore/domain/' + domain.id
          })
        }
      })
    },
    loadCollections() {
      this.busy = true
      getDomainCollections({
        id: this.$route.params.id,
        offset: this.offset,
        limit: this.limit,
        order: this.order
      }).then((res) => {
        console.log(res.items)
        if (this.offset === 0) {
          this.collections.splice(0, this.collections.length)
        }
        if (res.items.length < this.limit) {
          this.done = true
          this.busy = true
          this.offset += this.limit
        } else {
          this.busy = false
        }
        this.collections.push(...res.items)
      })
    },
    loadDomain() {
      getDomain({
        id: this.$route.params.id
      }).then((res) => {
        this.domain = res.items[0]
        document.title = this.domain.title + ' - 阡陌'
      })
      if (this.isLoggedIn) {
        checkCertify({ id: this.$route.params.id }).then((res) => {
          if (res.items.length === 1) {
            this.certified = true
          }
        })
      }
    },
    onClickStartToStudy() {
      learn({ domain: this.domain.id }).then((res) => {
        if (res.items.length === 1) {
          this.$router.push({
            path: '/person/learn/domain/' + this.domain.id
          })
        } else {
          this.$toasted.show('添加失败，请稍后再试')
        }
      })
    }
  },
  computed: {
    isLoggedIn() {
      return UserModule.isLoggedIn
    },
    isModifiable() {
      return this.domain && UserModule.isLoggedIn && this.domain.id !== 1 && this.certified
    }
  }
})
</script>
