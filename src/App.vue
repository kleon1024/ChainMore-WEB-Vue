<template>
  <router-view />
</template>

<script>
import Vue from 'vue'
import { GlobalModule } from '@/store/modules/global'

export default Vue.extend({
  name: 'App',
  components: {},
  data: () => ({}),
  mounted() {
    this.$vuetify.theme.dark = GlobalModule.darkTheme
  }
})
</script>
