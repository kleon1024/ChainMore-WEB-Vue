<template>
  <v-container>
    <v-row align='center' justify='center'>
      <v-card v-for='(domain, index) in domains' :key='index' width='60%' style='margin-top:20px'>
        <v-card-text>
          <p class='display-1 text--primary'>{{ domain.title }}</p>
          <div class='text--primary'>{{ domain.intro }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn text color='deep-purple accent-4'>LEARN MORE</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getDomains } from '@/api/domains'

export default Vue.extend({
  name: 'DomainGroup',
  data: () => ({
    domains: []
  }),
  mounted() {
    this.loadData().then(() => {
      console.log('Data loaded')
    })
  },
  methods: {
    loadData() {
      return new Promise((resolve) => {
        getDomains({}).then((res) => {
          this.domains.push(...res.items)
          resolve(res)
        })
      })
    }
  }
})
</script>
