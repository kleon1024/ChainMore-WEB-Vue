<template>
<v-container>
  <v-switch
    v-model="darkTheme"
    inset
  ></v-switch>
</v-container>
</template>

<script>
import Vue from 'vue'
import { GlobalModule } from '@/store/modules/global'

export default Vue.extend({
  name: 'AppBar',
  components: {},
  data() {
    return {
      darkTheme: false
    }
  },
  mounted() {
    this.darkTheme = GlobalModule.darkTheme
    this.$vuetify.theme.dark = this.darkTheme
  },
  watch: {
    darkTheme(val) {
      this.$vuetify.theme.dark = val
      GlobalModule.UpdateDarkTheme(val)
    }
  }
})
</script>
