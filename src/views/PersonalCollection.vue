<template>
  <v-container fluid>
    <v-card>
      <v-row>
        <v-subheader class="mx-3">合集</v-subheader>
        <v-card-actions>
          <v-btn
            icon
            x-small
            color='teal'
            class="mx-3"
            :to="{ path: '/op/create/collection' }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card
      class="my-1"
      v-for="(collection, index) in collections"
      :key="index"
      :to="{ path:'/explore/collection/' + collection.id}"
    >
      <v-card-text>
        <div class='caption font-weight-bold text--primary'> {{ collection.domaintitle }}</div>
        <div class='body-2 text--primary'> {{ collection.title }} </div>
        <div class='caption'> 收藏于 {{ readableTime(collection.collect_time) }} </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getCollectedCollections } from '@/api/collections'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'PersonalCollection',
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
    getCollectedCollections({ limit: 999 }).then((res) => {
      this.collections.splice(0, this.collections.length)
      this.collections.push(...res.items)
    })
  }
})
</script>
