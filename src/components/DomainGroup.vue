<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        v-for='(domain, index) in domains'
        :key='index'
        :width='width'
        style='margin-top:20px'
      >
        <v-card-text>
          <p class='display-1 text--primary'>{{ domain.title }}</p>
          <div class='text--primary'>{{ domain.intro }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            x-small
            color='teal'
            :to="{ path: '/domain/' + domain.id.toString() }"
          >Learn More</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'DomainGroup',
  props: {
    domains: {
      required: false,
      default: []
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
