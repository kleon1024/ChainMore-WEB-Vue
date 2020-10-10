<template>
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
          <v-btn
            icon
            x-small
            color='teal'
            class="mx-3"
            :to="{ path: '/person/resource'}"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
          </v-card-actions>
      </v-row>
      <v-list>
      <template v-for="(resource, index) in resources">
      <v-list-item :key="index">
            <router-link :to="{ path: '/explore/resource/' + resource.id}">
            <div class='subtitle-1 text--primary'> {{ resource.title }} </div>
            <div class='subtitle-2 text--primary'><a
                target='_blank'
                :href="resource.url"
              >{{ resource.url }}</a></div>
            <div class='subtitle-2 text--primary font-weight-light'>收藏于 {{ readableTime(resource.star_time) }} </div>
            </router-link>
      </v-list-item>
      </template>
      </v-list>
    </v-card>
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
  }
})
</script>
