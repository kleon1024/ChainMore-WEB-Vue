<template>
  <v-container>
    <PersonalCollectionCards />
  </v-container>
</template>

<script>
import Vue from 'vue'
import PersonalCollectionCards from '@/components/PersonalCollectionCards.vue'

export default Vue.extend({
  name: 'CollectionPanel',
  components: {
    PersonalCollectionCards
  }
})
</script>
