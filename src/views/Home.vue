<template>
  <div class='home'>
    <!-- <v-app-bar
      app
      color="white"
      hide-on-scroll
    >
      <v-toolbar-title>阡陌</v-toolbar-title>
      <div class='d-flex align-center'></div>
      <v-spacer></v-spacer>
    </v-app-bar> -->
    <AggregateCard />
    <SearchBar
      @focus="onFocused"
      id="search"
    />
    <v-card
      :height="height"
      :elevation="0"
    >
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src
import AggregateCard from '@/components/AggregateCard.vue'
import SearchBar from '@/components/SearchBar.vue'
// import DependCard from '@/components/DependCard.vue'
import VueScrollTo from 'vue-scrollto'

export default {
  name: 'Home',
  components: {
    AggregateCard,
    SearchBar
    // DependCard
  },
  computed: {
    height() {
      return window.innerHeight
    }
  },
  methods: {
    onFocused() {
      const options = {
        offset: -window.innerHeight / 12
      }
      VueScrollTo.scrollTo('#search', options)
    }
  }
}
</script>
