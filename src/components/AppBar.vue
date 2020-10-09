<template>
  <v-app-bar
    app
    color="white"
    hide-on-scroll
    elevation="0"
    dense
  >
    <v-container class="fill-height">
      <a href="/">
        <v-toolbar-title class="title font-weight-bold">阡陌</v-toolbar-title>
      </a>
      <div class='d-flex align-center'></div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        to="/roadmap"
      >
        <v-icon color="teal">mdi-transit-connection-variant</v-icon>
      </v-btn>
      <v-btn
        icon
        to="/person"
        color="teal"
      >
        <v-icon
          v-if="!loggedIn"
          color="teal"
        >person_outline</v-icon>
        <div
          v-if="loggedIn"
          class="font-weight-bold headline"
        > {{ capital }} </div>
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'

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
