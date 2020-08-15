<template>
  <v-container>
    <v-card :width="width">
      <v-row>
        <v-subheader class="padding-horizontal">领域</v-subheader>
        <v-spacer> </v-spacer>
        <v-btn
          text
          color='teal'
          class="padding-horizontal"
        >
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(domain, index) in domains"
        :key="index"
      >
        <a :href="'/domain/' + domain.id">
          <v-card
            :elevation="0"
            color="transparent"
            :width="width"
          >
            <v-card-text class="padding-horizontal">
              <div class='title text--primary'> {{ domain.title }} </div>
              <div> 收藏于 {{ domain.mark_time }} </div>
            </v-card-text>
          </v-card>
        </a>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getMarkedDomains } from '@/api/domains'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {},
  data: () => ({
    domains: [],
    searchInput: ''
  }),
  mounted() {
    getMarkedDomains({ limit: 3 }).then((res) => {
      this.domains.splice(0, this.domains.length)
      this.domains.push(...res.items)
    })
  },
  computed: {
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.618
      } else {
        return width * 0.9
      }
    }
  }
})
</script>

<style>
.padding-horizontal {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
