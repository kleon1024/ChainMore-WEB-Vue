<template>
  <v-container>
    <v-card :width="width" color="transparent" elevation="0">
      <v-row
        align='center'
        justify='center'
      >
        <v-card :width="width">
          <v-row>
            <v-subheader class="padding-horizontal">领域</v-subheader>
            <v-spacer> </v-spacer>
            <v-card-actions>
              <v-btn
                text
                color='teal'
                class="padding-horizontal"
                :to="{ path: '/op/create/domain' }"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-card>
      </v-row>
      <v-row
        align='center'
        justify='center'
        v-for="(domain, index) in domains"
        :key="index"
      >
        <v-card
          :width="width"
          :to="{ path: '/explore/domain/' + domain.id}"
          style="margin-top: 1em"
        >
          <v-card-text>
            <div class='title text--primary'> {{ domain.title }} </div>
            <div> 收藏于 {{ readableTime(domain.mark_time) }} </div>
          </v-card-text>
        </v-card>
      </v-row>
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
  },
  computed: {
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
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
