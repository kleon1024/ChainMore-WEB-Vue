<template>
  <v-container>
    <v-card :width="width">
      <v-row>
        <v-subheader class="padding-horizontal">合集</v-subheader>
        <v-spacer> </v-spacer>
        <v-card-actions>
          <v-btn
            text
            color='teal'
            class="padding-horizontal"
            :to="{ path: '/op/create/collection' }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
          <v-btn
            text
            color='teal'
            class="padding-horizontal"
            :to="{ path: '/person/collection'}"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
      <v-row
        v-for="(collection, index) in collections"
        :key="index"
        align="center"
        justify="center"
      >
        <v-card
          :elevation="0"
          color="transparent"
          :width="width"
          :to="{ path: '/collection/' + collection.id}"
        >
          <v-card-text>
            <div class='text--primary'> {{ collection.domain_title }}</div>
            <div class='title text--primary'> {{ collection.title }} </div>
            <div> 收藏于 {{ readableTime(collection.collect_time) }} </div>
          </v-card-text>
        </v-card>
      </v-row>
    </v-card>
  </v-container>
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

<style>
.padding-horizontal {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
