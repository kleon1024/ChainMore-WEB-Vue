<template>
  <v-container>
    <v-card :width="width" color="transparent" elevation="0">
      <v-row
        align="center"
        justify='center'
      >
        <v-card :width="width">
          <v-row>
            <v-subheader class="padding-horizontal">资源</v-subheader>
            <v-spacer> </v-spacer>
            <v-card-actions>
              <v-btn
                text
                color='teal'
                class="padding-horizontal"
                :to="{ path: '/create/resource', query: { nextUrl: '/person'} }"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-card>
      </v-row>
      <v-row
        align="center"
        justify='center'
        v-for="(resource, index) in resources"
        :key="index"
      >
        <v-card
          :width="width"
          :to="{path: '/resource/' + resource.id}"
          style="margin-top: 1em"
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
    getStaredResources({ limit: 999 }).then((res) => {
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
        return width * 0.9
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
