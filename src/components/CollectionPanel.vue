<template>
    <v-card>
      <v-row>
        <v-subheader class="padding-horizontal">合集</v-subheader>
        <v-card-actions>
          <v-btn
            icon
            x-small
            color='teal'
            class="padding-horizontal"
            :to="{ path: '/op/create/collection' }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
          <v-btn
            icon
            x-small
            color='teal'
            class="padding-horizontal"
            :to="{ path: '/person/collection'}"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
      <v-list>
      <template
        v-for="(collection, index) in collections"
      >
      <v-list-item
        :key="index"
      >
        <router-link
          :to="{ path: '/explore/collection/' + collection.id}"
        >
            <div class='subtitle-1 text--primary'> {{ collection.domain_title }}</div>
            <div class='subtitle-2 text--primary'> {{ collection.title }} </div>
            <div class='subtitle-2 font-weight-light'> 收藏于 {{ readableTime(collection.collect_time) }} </div>
        </router-link>
      </v-list-item>
      </template>
      </v-list>
    </v-card>
</template>

<script>
import Vue from 'vue'
import { getCollectedCollections } from '@/api/collections'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'CollectionPanel',
  components: {},
  data: () => ({
    collections: [],
    searchInput: ''
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    getCollectedCollections({ limit: 3 }).then((res) => {
      this.collections.splice(0, this.collections.length)
      this.collections.push(...res.items)
    })
  }
})
</script>
