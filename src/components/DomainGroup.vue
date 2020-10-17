<template>
  <div>
    <div
      v-for='(domain, index) in domains'
      :key='index'
    >
      <v-card
        v-if="!domain.noResult"
        :to="{ path: '/explore/domain/' + domain.id.toString() }"
        class="mt-2"
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
    </div>
  </div>
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
  }
})
</script>
