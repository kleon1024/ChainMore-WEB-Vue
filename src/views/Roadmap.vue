<template>
  <v-container fluid>
    <DependCard />
  </v-container>
</template>

<script>
// @ is an alias to /src
import DependCard from '@/components/DependCard.vue'

export default {
  name: 'Roadmap',
  components: {
    DependCard
  }
}
</script>
