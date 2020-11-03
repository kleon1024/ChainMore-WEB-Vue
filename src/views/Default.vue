<template>
  <v-app id="explore">
    <AppBar />
    <v-main>
      <v-container>
        <AggregateCard />
        <SearchBar
          @focus="onFocused"
          id="search"
          class="px-5"
        />
        <v-card
          min-height="100vh"
          :elevation="0"
          color="transparent"
        >
        </v-card>
      </v-container>
    </v-main>
  </v-app>
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
