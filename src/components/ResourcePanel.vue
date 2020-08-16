<template>
  <v-container>
    <v-card :width="width">
      <v-row>
        <v-subheader class="padding-horizontal">资源</v-subheader>
        <v-spacer> </v-spacer>
        <v-card-actions>
          <v-btn
            text
            color='teal'
            class="padding-horizontal"
            :to="{ path: '/op/create/resource', query: { nextUrl: '/person'} }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
          <v-btn
            text
            color='teal'
            class="padding-horizontal"
            :to="{ path: '/person/resource'}"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
      <v-row
        v-for="(resource, index) in resources"
        :key="index"
        align="center"
        justify="center"
      >
        <v-card
          :elevation="0"
          color="transparent"
          :width="width"
          :to="{ path: '/resource/' + resource.id}"
        >
          <v-card-text>
            <div class='title text--primary'> {{ resource.title }} </div>
            <div class='text--primary'><a
                target='_blank'
                :href="resource.url"
              >{{ resource.url }}</a></div>
            <div> 收藏于 {{ readableTime(resource.star_time) }} </div>
          </v-card-text>
        </v-card>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getStaredResources } from '@/api/resources'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {},
  data: () => ({
    resources: [],
    searchInput: ''
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    getStaredResources({ limit: 3 }).then((res) => {
      this.resources.splice(0, this.resources.length)
      this.resources.push(...res.items)
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

<style scoped>
.padding-horizontal {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
