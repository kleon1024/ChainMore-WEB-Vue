<template>
  <v-app id="explore">
    <v-app-bar
      app
      elevation="0"
      color="white"
    >
      <v-toolbar-title class="mr-3 align-center">
        <a href="/"> <span class="headline font-weight-bold">阡陌</span> </a>
      </v-toolbar-title>
      <v-responsive max-width="365">
        <v-text-field
          dense
          flat
          hide-details
          solo-inverted
        >
        </v-text-field>
      </v-responsive>
      <v-spacer></v-spacer>

      <v-btn
        icon
        color="primary"
        v-if="loggedIn"
        :to="{path: '/person'}"
      >
        <div class="font-weight-bold headline"> {{ capital }} </div>
      </v-btn>
      <v-btn
        text
        class="subtitle-1"
        color="primary"
        v-if="!loggedIn"
        :to="{path: '/login', query: { nextUrl: $route.path}}"
      >
        登录
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="2"
          />
          <v-col
            cols="12"
            sm="8"
          >
            <router-view />
          </v-col>
          <v-col
            cols="12"
            sm="2"
          />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'

export default Vue.extend({
  name: 'Explore',
  components: {},
  methods: {
    onClickLogOut() {
      this.$router.replace({ path: '/' })
      if (UserModule.isLoggedIn) {
        UserModule.LogOut()
      }
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
    }
  }
})
</script>
