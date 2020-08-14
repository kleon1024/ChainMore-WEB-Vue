<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list
        flat
        dense
      >
        <v-list-item-group
          v-model="selectedTag"
          active-class="active"
        >
          <v-list-item
            v-for="item in items"
            :key="item.text"
            :to="{ path: item.to }"
            link
          >
            <v-row class="padding-horizontal">
              <v-list-item-action>
                <a :href="item.to">
                  <v-icon>{{ item.icon }}</v-icon>
                </a>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title class="text--primary">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-row>
          </v-list-item>

          <!-- <v-subheader class="mt-4 grey--text text--darken-1">SUBSCRIPTIONS</v-subheader> -->

          <!-- <v-list-item
            v-for="item in items2"
            :key="item.text"
            link
          >
            <v-list-item-avatar>
              <img
                :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`"
                alt=""
              >
            </v-list-item-avatar>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
          <v-list-item
            class="mt-4"
            link
          >
            <v-list-item-action>
              <v-icon color="grey darken-1">mdi-plus-circle-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title class="grey--text text--darken-1">Browse Channels</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon color="grey darken-1">mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-title class="grey--text text--darken-1">Manage Subscriptions</v-list-item-title>
          </v-list-item> -->
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      dense
      elevation="0"
      color="white"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-12 align-center">
        <a href="/"> <span class="title">阡陌</span> </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row
        align="center"
        style="max-width: 650px"
      >
        <!-- <v-text-field
          :append-icon-cb="() => {}"
          placeholder="Search..."
          single-line
          append-icon="mdi-magnify"
          color="white"
          hide-details
        ></v-text-field> -->
      </v-row>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Person',
  components: {},
  props: {
    source: String
  },
  data() {
    return {
      collections: [],
      domain: null,
      drawer: null,
      selectedTag: '',
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
          text: '标记领域',
          to: '/person/domain'
        }
      ],
      remap: {
        '/person': '个人主页',
        '/person/resource': '收藏资源'
      },
      items2: [
        { picture: 28, text: 'Joseph' },
        { picture: 38, text: 'Apple' },
        { picture: 48, text: 'Xbox Ahoy' },
        { picture: 58, text: 'Nokia' },
        { picture: 78, text: 'MKBHD' }
      ]
    }
  },
  computed: {
    width() {
      let width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        width = height
      }
      return width * 0.9
    }
  },
  watch: {
    selectedTag(val) {
      console.log(val)
    }
  }
})
</script>

<style scoped>
.active {
  background-color: lightgrey;
}
.padding-horizontal {
  margin-left: 0em;
  margin-right: 0em;
}
</style>
