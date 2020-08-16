<template>
  <v-container>
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
  </v-container>
</template>

<script>
// @ is an alias to /src
import AggregateCard from '@/components/AggregateCard.vue'
import SearchBar from '@/components/SearchBar.vue'
// import DependCard from '@/components/DependCard.vue'
import VueScrollTo from 'vue-scrollto'
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'Default',
  components: {
    AggregateCard,
    SearchBar,
    AppBar
    // DependCard
  },
  mounted() {
    this.scrollToTop()
  },
  computed: {
    height() {
      return window.innerHeight
    }
  },
  methods: {
    scrollToTop() {
      this.$nextTick(() => {
        window.scrollTo(0, 0)
      })
    },
    onFocused() {
      const options = {
        offset: -window.innerHeight / 12
      }
      VueScrollTo.scrollTo('#search', options)
    }
  }
}
</script>
