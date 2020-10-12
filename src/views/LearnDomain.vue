<template>
  <v-container fluid>
    <v-stepper
      vertical
      v-model="step"
      class="elevation-0"
    >
      <template v-for="(domain, index) in dependDomains">
        <v-stepper-step
          :key="`${index}-step`"
          :complete="domain.certified"
          :step="index"
        >
          <v-btn text @click="step = index">
            {{ domain.title }}
          </v-btn>
        </v-stepper-step>
        <v-stepper-content
          :key="`${index}-content`"
          :step="index"
        >
          {{ domain.description}}
        </v-stepper-content>
      </template>
    </v-stepper>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  getDomain,
  getDependedDomains
} from '@/api/domains'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ManageDomain',
  components: {
  },
  data() {
    return {
      domain: null,
      step: 0,
      dependDomains: []
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    loadDomain() {
      getDomain({
        id: this.$route.params.id
      }).then((res) => {
        this.domain = res.items[0]
      })
    },
    loadDependDomains() {
      getDependedDomains({ id: this.$route.params.id, distance: 999 }).then(
        (res) => {
          this.dependDomains.splice(0, this.dependDomains.length)
          this.dependDomains.push(...res.items)
        }
      )
    }
  },
  mounted() {
    this.loadDomain()
    this.loadDependDomains()
  }
})
</script>
