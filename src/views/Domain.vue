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
        vertical
        v-model="step"
        class="elevation-0"
      >
        <template v-for="(domain, index) in dependDomains">
          <v-stepper-step
            :key="`${index}-step`"
            :complete="step > index"
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
        :width="width"
      >
        <v-card-text>
          <p> 领域 </p>
          <p class='display-1 text--primary'>{{ domain.title }}</p>
          <div class='text--primary'>{{ domain.intro }}</div>
        </v-card-text>
        <v-card-actions>
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
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        :width='width'
        style='margin-top:20px'
        elevation="0"
      >
        <v-menu v-model="showMenu">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
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
        :width='width'
        style='margin-top:20px'
        :to="{ path: '/collection/' + collection.id.toString() }"
      >
        <v-card-text>
          <div class='text--primary'> {{ collection.domain_title }}</div>
          <p> </p>
          <p class='headline text--primary'>{{ collection.title }}</p>
          <p> </p>
          <div class='text--primary'>{{ collection.description }}</div>
          <p> </p>
          <p class="text--primary"> {{ collection.modify_time }} </p>
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
    console.log(this.step)
  },
  methods: {
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
        this.$route.push({
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
      isMarkDomain({ id: this.$route.params.id }).then((res) => {
        if (res.items.length === 1) {
          this.marked = true
        } else {
          this.marked = false
        }
      })
    },
    refresh(order, orderDesc) {
      this.order = order
      this.orderDesc = orderDesc
      this.loadCollections()
    },
    loadDependDomains() {
      getDependedDomains({ id: this.$route.params.id, distance: 999 }).then(
        (res) => {
          this.dependDomains.splice(0, this.dependDomains.length)
          this.dependDomains.push(...res.items)
        }
      )
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
    }
  },
  computed: {
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
      } else {
        return width * 0.9
      }
    }
  }
})
</script>
