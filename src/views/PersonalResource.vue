<template>
  <v-container>
    <PersonalResourceCards />
  </v-container>
</template>

<script>
import Vue from 'vue'
import PersonalResourceCards from '@/components/PersonalResourceCards.vue'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {
    PersonalResourceCards
  }
})
</script>
