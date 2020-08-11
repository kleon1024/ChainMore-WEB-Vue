<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card v-if="collection" :width="width">
        <v-card-text>
          <p class='display-1 text--primary'>{{ collection.title }}</p>
          <div class='text--primary'>{{ collection.description }}</div>
        </v-card-text>
      </v-card>
      <v-card
        v-for='(resource, index) in resources'
        :key='index'
        :width='width'
        style='margin-top:20px'
      >
        <v-card-text>
          <p class='title text--primary'>{{ resource.title }}</p>
          <div class='text--primary'><a target='_blank' :href="resource.url">{{ resource.url }}</a></div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getCollectionResources, getCollection } from '@/api/collections'

export default Vue.extend({
  name: 'Collection',
  data() {
    return {
      resources: [],
      collection: null
    }
  },
  mounted() {
    this.loadResources()
    this.loadDomain()
  },
  methods: {
    loadResources() {
      getCollectionResources({
        id: this.$route.params.id
      }).then((res) => {
        this.resources.push(...res.items)
      })
    },
    loadDomain() {
      getCollection({
        id: this.$route.params.id
      }).then((res) => {
        this.collection = res.items[0]
      })
    }
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
