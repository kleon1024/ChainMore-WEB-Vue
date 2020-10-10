<template>
  <v-container fluid>
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
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card
      class="my-1"
      v-for="(domain, index) in domains"
      :key="index"
      :to="{ path: '/explore/domain/' + domain.id}"
    >
      <v-card-text>
        <div class='body-2 text--primary'> {{ domain.title }} </div>
        <div class='caption'> 收藏于 {{ readableTime(domain.mark_time) }} </div>
      </v-card-text>
    </v-card>
  </v-container>
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
    getMarkedDomains({ limit: 999 }).then((res) => {
      this.domains.splice(0, this.domains.length)
      this.domains.push(...res.items)
    })
  }
})
</script>
