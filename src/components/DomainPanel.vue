<template>
    <v-card>
      <v-row>
        <v-subheader class="mx-3">领域</v-subheader>
        <v-card-actions>
          <v-btn
            icon
            x-small
            color='teal'
            class="mx-3"
            :to="{ path: '/op/create/domain' }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
          <v-btn
            icon
            x-small
            color='teal'
            class="mx-3"
            :to="{ path: '/person/domain'}"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
      <v-list>
      <template v-for="(domain, index) in domains">
      <v-list-item :key="index">
        <router-link :to="{ path: '/explore/domain/' + domain.id}" >
            <div class='subtitle-2 text--primary'> {{ domain.title }} </div>
            <div class='caption font-weight-light'> 收藏于 {{ readableTime(domain.mark_time) }} </div>
        </router-link>
      </v-list-item>
      </template>
      </v-list>
    </v-card>
</template>

<script>
import Vue from 'vue'
import { getMarkedDomains } from '@/api/domains'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {},
  data: () => ({
    domains: [],
    searchInput: ''
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
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
        return width * 0.382
      } else {
        return width * 0.93
      }
    }
  }
})
</script>

<style>
.mx-3 {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
