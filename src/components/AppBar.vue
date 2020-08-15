<template>
  <v-app-bar
    app
    color="white"
    hide-on-scroll
    elevation="0"
    dense
  >
    <a href="/">
      <v-toolbar-title class="headline font-weight-bold">阡陌</v-toolbar-title>
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
    >
      <v-icon color="teal">person_outline</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
  components: {},
  computed: {},
  methods: {}
}
</script>
