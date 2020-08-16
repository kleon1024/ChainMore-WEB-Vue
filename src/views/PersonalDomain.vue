<template>
  <v-container>
    <PersonalDomainCards />
  </v-container>
</template>

<script>
import Vue from 'vue'
import PersonalDomainCards from '@/components/PersonalDomainCards.vue'

export default Vue.extend({
  name: 'DomainPanel',
  components: {
    PersonalDomainCards
  }
})
</script>
