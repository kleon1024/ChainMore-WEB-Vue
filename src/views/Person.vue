<template>
  <v-app id="person">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list
        flat
        dense
      >
        <v-list-item
          v-for="item in items"
          :key="item.text"
          :to="{ path: item.to }"
          :value="item.text"
          :class="activeClass(item.to)"
        >
          <v-row class="mx-3">
            <v-list-item-icon>
              <v-icon :color="activeColor(item.to)">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-row>
        </v-list-item>
        <v-divider />
        <v-subheader class="mx-4 subtitle-2 grey--text text--darken-1">领域管理</v-subheader>
        <v-list-item
          v-for="item in manageDomains.slice(0, topNDomain)"
          :key="'manage' + item.text"
          :to="{ path: item.to }"
          :value="item.text"
          :class="activeClass(item.to)"
        >
          <v-row class="mx-3">
            <v-list-item-icon>
              <v-icon :color="activeColor(item.to)">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-row>
        </v-list-item>
        <v-list-item
          v-if="manageDomains.length > topNDomain || expanded"
          @click="expandAllDomains"
        >
          <v-row class="mx-3">
            <v-list-item-icon>
              <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'}} </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ expanded ? '收起' : `展示其他${manageDomains.length - topNDomain}条` }}
              </v-list-item-title>
            </v-list-item-content>
          </v-row>
        </v-list-item>
        <v-subheader class="mx-4 subtitle-2 grey--text text--darken-1">正在学习</v-subheader>
        <v-list-item
          v-for="item in targetDomains.slice(0, topNTargetDomain)"
          :key="'target' + item.text"
          :to="{ path: item.to }"
          :value="item.text"
          :class="activeClass(item.to)"
        >
          <v-row class="mx-3">
            <v-list-item-icon>
              <v-icon :color="activeColor(item.to)">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-row>
        </v-list-item>
        <v-list-item
          v-if="targetDomains.length > topNTargetDomain || targetExpanded"
          @click="expandAllTargetDomains"
        >
          <v-row class="mx-3">
            <v-list-item-icon>
              <v-icon>{{ targetExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'}} </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ targetExpanded ? '收起' : `展示其他${targetDomains.length - topNTargetDomain}条` }}
              </v-list-item-title>
            </v-list-item-content>
          </v-row>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      elevation="0"
      color="white"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-3 align-center">
        <a href="/"> <span class="headline font-weight-bold">阡陌</span> </a>
      </v-toolbar-title>
      <v-responsive max-width="365">
        <v-text-field
          v-model="query"
          dense
          flat
          hide-details
          solo-inverted
        >
        </v-text-field>
      </v-responsive>
      <v-spacer></v-spacer>

      <v-menu
        offset-y
        outline
        content-class="elevation-1"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="teal"
            v-on="on"
          >
            <v-icon
              v-if="!loggedIn"
              color="teal"
            >mdi-account-outline</v-icon>
            <div
              v-if="loggedIn"
              class="font-weight-bold headline"
            > {{ capital }} </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            dense
            v-for="(action, index) in actions"
            :key="index"
            @click="action.function"
          >
            <v-list-item-icon>
              <v-icon v-text="action.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ action.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <keep-alive>
        <router-view :key="$route.fullPath" :query="query" />
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
import { PersonModule } from '@/store/modules/person'
import { GlobalModule } from '@/store/modules/global'

export default Vue.extend({
  name: 'Person',
  components: {},
  props: {
    source: String
  },
  methods: {
    active(path) {
      return path === this.$route.path
    },
    activeColor(path) {
      if (this.active(path)) {
        return 'teal'
      } else {
        return 'grey'
      }
    },
    activeClass(path) {
      if (this.active(path)) {
        return 'active'
      } else {
        return ''
      }
    },
    onClickLogOut() {
      this.drawer = !this.drawer
      this.$router.replace({ path: '/' })
      if (UserModule.isLoggedIn) {
        UserModule.LogOut()
      }
    },
    expandAllDomains() {
      if (!this.expanded) {
        this.topNDomain = this.manageDomains.length
        this.expanded = true
      } else {
        this.topNDomain = 1
        this.expanded = false
      }
    },
    expandAllTargetDomains() {
      if (!this.targetExpanded) {
        this.topNTargetDomain = this.targetDomains.length
        this.targetExpanded = true
      } else {
        this.topNTargetDomain = 1
        this.targetExpanded = false
      }
    }
  },
  data() {
    return {
      query: '',
      collections: [],
      domain: null,
      drawer: null,
      selectedTag: 0,
      action: 1,
      actions: [
        {
          name: '退出登录',
          function: this.onClickLogOut,
          icon: 'mdi-logout-variant'
        }
      ],
      items: [
        {
          icon: 'mdi-infinity',
          text: '个人主页',
          to: '/person'
        },
        {
          icon: 'mdi-link-variant',
          text: '收藏资源',
          to: '/person/resource'
        },
        {
          icon: 'mdi-format-list-bulleted',
          text: '收藏集合',
          to: '/person/collection'
        },
        {
          icon: 'mdi-google-circles-communities',
          text: '收藏领域',
          to: '/person/domain'
        }
      ],
      expanded: false,
      targetExpanded: false,
      topNDomain: 3,
      topNTargetDomain: 3
    }
  },
  computed: {
    loggedIn() {
      return UserModule.isLoggedIn
    },
    capital() {
      if (UserModule.isLoggedIn) {
        return UserModule.username[0]
      } else {
        return ''
      }
    },
    manageDomains() {
      return PersonModule.certifiedDomains
    },
    targetDomains() {
      return PersonModule.targetDomains
    }
  },
  mounted() {
    PersonModule.Initialize()
    GlobalModule.UpdateResourceType()
  }
})
</script>

<style scoped>
.active {
  background-color: lightgrey;
}
</style>
