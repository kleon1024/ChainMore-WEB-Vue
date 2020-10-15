<template>
  <v-container fluid>
    <v-card>
      <v-row>
        <v-subheader class="mx-3">领域</v-subheader>
        <v-card-actions>
          <v-btn
            icon
            x-small
            color='teal'
            class="mx-3"
            :to="{ path: '/op/create/domain' }"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card
      class="my-1"
      v-for="(domain, index) in searchedDomains"
      :key="index"
      :to="{ path: '/explore/domain/' + domain.id}"
    >
      <v-card-text>
        <div class='body-2 text--primary'> {{ domain.title }} </div>
        <div class='caption'> 收藏于 {{ readableTime(domain.mark_time) }} </div>
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
  name: 'ResourcePanel',
  components: {},
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    searchedDomains: [],
    searchInput: ''
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    this.searchedDomains.push(...PersonModule.domains)
  },
  watch: {
    query(val) {
      this.searchedDomains.splice(0, this.searchedDomains.length)
      this.searchedDomains.push(
        ...searchQuery(val, PersonModule.domains,
          (r, q) => r.title.toLowerCase().includes(q) || r.intro.toLowerCase().includes(q)))
    }
  }
})
</script>
