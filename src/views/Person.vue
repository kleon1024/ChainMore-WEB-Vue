<template>
  <v-container>
    <AppBar />
    <v-row
      align='center'
      justify='center'
    >
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getDomainCollections, getDomain } from '@/api/domains'
import AppBar from '@/components/AppBar.vue'

export default Vue.extend({
  name: 'Person',
  components: {
    AppBar
  },
  data() {
    return {
      collections: [],
      domain: null
    }
  },
  methods: {
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
  }
})
</script>
