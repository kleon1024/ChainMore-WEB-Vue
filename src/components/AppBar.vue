<template>
  <v-app-bar
    app
    elevation="0"
    color="appbar"
    dense
  >
    <a href="/">
      <v-toolbar-title class="title font-weight-bold">阡陌</v-toolbar-title>
    </a>

    <div class='d-flex align-center'></div>
    <v-spacer></v-spacer>
    <v-toolbar-items>
    <v-btn
      icon
      to="/explore/roadmap"
    >
      <v-icon color="primary">mdi-transit-connection-variant</v-icon>
    </v-btn>
    <v-btn
      icon
      to="/person"
      color="primary"
    >
      <v-icon
        v-if="!loggedIn"
        color="primary"
      >mdi-account-outline</v-icon>
      <div
        v-if="loggedIn"
        class="font-weight-bold headline"
      > {{ capital }} </div>
    </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
import { GlobalModule } from '@/store/modules/global'

export default Vue.extend({
  name: 'AppBar',
  components: {},
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
