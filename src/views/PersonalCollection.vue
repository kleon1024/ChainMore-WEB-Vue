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
      v-for="(collection, index) in searchedCollections"
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
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    searchedCollections: [],
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
      this.searchedCollections.push(...res.items)
    })
  },
  watch: {
    query(val) {
      const qs = val.split(' ')
      this.searchedCollections.splice(0, this.searchedCollections.length)
      if (val === '' || qs.length === 0) {
        this.searchedCollections.push(...this.collections)
        return
      }
      const d = {}
      const temp = []
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i]
        for (let j = 0; j < this.collections.length; j++) {
          const r = this.collections[j]
          if (r.title.includes(q) || r.description.includes(q)) {
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
      this.searchedCollections.push(...temp.sort((a, b) => b.count - a.count))
    }
  }
})
</script>
