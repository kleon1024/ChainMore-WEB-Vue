<template>
  <v-container>
    <AppBar />
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
          <v-stepper-content
            :key="`${index}-content`"
            :step="index"
          >
            {{ domain.description}}
          </v-stepper-content>
        </template>
      </v-stepper>
      <v-container>
        <v-btn
          v-if="isLoggedIn"
          block
          outlined
          color="primary"
          :to="{path: '/login', query: { nextUrl: $route.path}}"
        > 开始学习 </v-btn>
      </v-container>
      <v-container
        fluid
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
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        v-if="domain"
        :width="width()"
      >
        <v-card-text>
          <div> 领域 </div>
          <div class='title font-weight-bold text--primary'>{{ domain.title }}</div>
          <div
            v-if="domain.intro != ''"
            class='text--primary'
          >{{ domain.intro }}</div>
          <div> {{ readableTime(domain.create_time) }} 创建 </div>
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
            <!-- <v-col v-if="isModifiable">
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
            </v-col> -->
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
            <v-col>
              <v-btn
                text
                :to="{ path: '/manage', query: { domain: domain.id }}"
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
    </v-row>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        :width='width()'
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
              <v-list-item-title>{{ opt.desc }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card>
    </v-row>
    <v-row
      align='center'
      justify='center'
      v-for='(collection, index) in collections'
      :key='index'
    >
      <v-card
        :width='width()'
        style='margin-top:10px'
        :to="{ path: '/collection/' + collection.id.toString() }"
      >
        <v-card-text>
          <div class='text--primary'> {{ collection.domain_title }}</div>
          <div class='title text--primary'>{{ collection.title }}</div>
          <div class='text--primary'>{{ collection.description }}</div>
          <div class="text--primary"> {{ readableTime(collection.modify_time) }} 修改 </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            x-small
            color='teal'
            :to="{ path: '/collection/' + collection.id.toString() }"
          >LEARN MORE</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
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
  getDependedDomains
} from '@/api/domains'
import AppBar from '@/components/AppBar.vue'
import { UserModule } from '@/store/modules/user'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'Domain',
  components: {
    AppBar
  },
  data() {
    return {
      collections: [],
      domain: null,
      showMenu: false,
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
      dependDomains: []
    }
  },
  mounted() {
    this.loadCollections()
    this.loadDomain()
    this.checkMark()
    this.loadDependDomains()
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
        return 'star'
      } else {
        return 'star_border'
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
    loadCollections() {
      getDomainCollections({
        id: this.$route.params.id,
        offset: 1,
        limit: 10,
        order: this.order
      }).then((res) => {
        this.collections.splice(0, this.collections.length)
        this.collections.push(...res.items)
      })
    },
    loadDomain() {
      getDomain({
        id: this.$route.params.id
      }).then((res) => {
        this.domain = res.items[0]
      })
    },
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
      } else {
        return width * 0.9
      }
    }
  },
  computed: {
    isLoggedIn() {
      return UserModule.isLoggedIn
    },
    isModifiable() {
      return this.domain && UserModule.isLoggedIn && this.domain.id !== 1
    }
  }
})
</script>
