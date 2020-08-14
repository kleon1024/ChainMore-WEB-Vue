<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        v-if="resource"
        :width="width"
      >
        <v-card-text>
          <p> 资源 </p>
          <p class='display-1 text--primary'>{{ resource.title }}</p>
          <a
            :href="resource.url"
            target="_blank"
          >
            <div>{{ resource.url }}</div>
          </a>
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
          <div class='text--primary'><a
              target='_blank'
              :href="resource.url"
            >{{ resource.url }}</a></div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getResource } from '@/api/resources'

export default Vue.extend({
  name: 'Resource',
  data() {
    return {
      resources: [],
      resource: null
    }
  },
  mounted() {
    this.loadResource()
  },
  methods: {
    loadResource() {
      getResource({
        id: this.$route.params.id
      }).then((res) => {
        this.resource = res.items[0]
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
