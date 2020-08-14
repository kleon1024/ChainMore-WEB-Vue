<template>
  <v-container>
    <v-card :width="width">
      <v-row>
        <v-subheader class="padding-horizontal">合集</v-subheader>
        <v-spacer> </v-spacer>
        <v-btn
          text
          color='teal'
          class="padding-horizontal"
        >
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(collection, index) in collections"
        :key="index"
      >
      <a :href="'/collection/' + collection.id">
        <v-card
          :elevation="0"
          color="transparent"
          :width="width"
        >
          <v-card-text class="padding-horizontal">
            <div class='title text--primary'> {{ collection.title }} </div>
            <div> 收藏于 {{ collection.collect_time }} </div>
          </v-card-text>
        </v-card>
      </a>
      </v-row>
    </v-card>
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
    getCollectedCollections({ limit: 3 }).then((res) => {
      this.collections.splice(0, this.collections.length)
      this.collections.push(...res.items)
    })
  },
  computed: {
    width() {
      let width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        width = height
      }
      return width * 0.9
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
