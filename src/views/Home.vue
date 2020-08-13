<template>
  <div class='home'>
    <AppBar />
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
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'Home',
  components: {
    AggregateCard,
    SearchBar,
    AppBar
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
