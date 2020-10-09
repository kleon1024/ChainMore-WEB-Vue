<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
      v-for='(domain, index) in domains'
      :key='index'
      style='margin-top:20px'
    >
      <v-card
        v-if="!domain.noResult"
        :width='width'
        :to="{ path: '/explore/domain/' + domain.id.toString() }"
      >
        <v-card-text>
          <div class='title text--primary font-weight-bold'>{{ domain.title }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color='teal'
            :to="{ path: '/explore/domain/' + domain.id.toString() }"
          >Learn More</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-if="domain.noResult"
        :width='width'
      >
        <v-card-text>
          <div class='title text--primary font-weight-bold'>{{ domain.desc }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color='teal'
            :to="{ path: '/op/create/domain', query: { domainName: domain.query }}"
          >立即创建</v-btn>
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
