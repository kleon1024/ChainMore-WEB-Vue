<template>
  <v-app-bar
    app
    color="white"
    hide-on-scroll
    elevation="0"
  >
    <a href="/">
      <v-toolbar-title style="font-weight: bold;font-size: 150%">阡陌</v-toolbar-title>
    </a>
    <div class='d-flex align-center'></div>
    <v-spacer></v-spacer>
    <v-btn
      icon
      to="/person"
    >
      <v-icon>person_outline</v-icon>
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
