<template>
  <v-container>
    <AppBar />
    <DependCard />
  </v-container>
</template>

<script>
// @ is an alias to /src
import DependCard from '@/components/DependCard.vue'
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'Roadmap',
  components: {
    DependCard,
    AppBar
  }
}
</script>
