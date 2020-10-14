<template>
  <v-container fluid>
    <v-card>
      <v-row>
        <v-subheader class="mx-3">资源</v-subheader>
        <v-card-actions>
          <v-btn
            icon
            x-small
            color='teal'
            class="mx-3"
            :to="{ path: '/op/create/resource' }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card
      class="my-1"
      v-for="(resource, index) in searchedResources"
      :key="index"
      :to="{path: '/explore/resource/' + resource.id}"
    >
      <v-row dense>
        <v-col>
          <v-card-text>
            <div class='body-2 font-weight-bold text--primary'> {{ resource.title }} </div>
            <div class='caption text--primary'><a
                target='_blank'
                :href="resource.url"
              >{{ resource.url }}</a></div>
             <div class='caption'> 收藏于 {{ readableTime(resource.star_time) }} </div>
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-actions>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getStaredResources } from '@/api/resources'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'PersonalResource',
  components: {},
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    resources: [],
    searchedResources: [],
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
      this.searchedResources.push(...res.items)
    })
  },
  watch: {
    query(val) {
      const qs = val.split(' ')
      this.searchedResources.splice(0, this.searchedResources.length)
      if (val === '' || qs.length === 0) {
        this.searchedResources.push(...this.resources)
        return
      }
      const d = {}
      const temp = []
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i]
        for (let j = 0; j < this.resources.length; j++) {
          const r = this.resources[j]
          if (r.title.includes(q) || r.url.includes(q)) {
            if (r.id in d) {
              d[r.id].count += 1
            } else {
              r.count = 1
              d[r.id] = r
              temp.push(r)
            }
          }
        }
      }
      this.searchedResources.push(...temp.sort((a, b) => b.count - a.count))
    }
  }
})
</script>
