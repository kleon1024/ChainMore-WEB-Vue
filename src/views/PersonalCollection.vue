<template>
  <v-container>
    <v-row align="center">
      <v-card :width="width">
        <v-row justify="center">
          <v-subheader class="padding-horizontal">合集</v-subheader>
          <v-spacer> </v-spacer>
          <v-card-actions>
            <v-btn
              text
              color='teal'
              class="padding-horizontal"
              :to="{ path: '/create/collection', query: { nextUrl: $route.path } }"
            >
              <v-icon> mdi-plus </v-icon>
            </v-btn>
          </v-card-actions>
        </v-row>
      </v-card>
    </v-row>
    <v-row
      v-for="(collection, index) in collections"
      :key="index"
    >
      <v-card
        :width="width"
        :to="{ path:'/collection/' + collection.id}"
        style="margin-top: 1em"
      >
        <v-card-text class="padding-horizontal">
          <div class='title text--primary'> {{ collection.title }} </div>
          <div> 收藏于 {{ collection.collect_time }} </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getCollectedCollections } from '@/api/collections'

export default Vue.extend({
  name: 'CollectionPanel',
  components: {},
  data: () => ({
    collections: [],
    searchInput: ''
  }),
  mounted() {
    getCollectedCollections({ limit: 999 }).then((res) => {
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
