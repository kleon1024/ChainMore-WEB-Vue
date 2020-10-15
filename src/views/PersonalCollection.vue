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
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'

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
    searchInput: ''
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    this.searchedCollections.push(...PersonModule.collections)
  },
  watch: {
    query(val) {
      this.searchedCollections.splice(0, this.searchedCollections.length)
      this.searchedCollections.push(
        ...searchQuery(val, PersonModule.collections,
          (r, q) => r.title.toLowerCase().includes(q) || r.description.includes(q)))
    }
  }
})
</script>
