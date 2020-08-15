<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        :elevation="0"
        :width="width"
      >
        <v-form @submit.native.prevent>
          <v-text-field
            v-model="searchInput"
            label="我想学"
            outlined
            @focus="onSearchBarFocused"
          ></v-text-field>
        </v-form>
      </v-card>
    </v-row>
    <DomainGroup :domains="domains" />
  </v-container>
</template>

<script>
import Vue from 'vue'
import DomainGroup from '@/components/DomainGroup.vue'
import { search } from '@/api/main'
import { getDomains } from '@/api/domains'

export default Vue.extend({
  name: 'SearchBar',
  components: {
    DomainGroup
  },
  data: () => ({
    domains: [],
    searchInput: ''
  }),
  mounted() {
    getDomains().then((res) => {
      this.domains.splice(0, this.domains.length)
      this.domains.push(...res.items)
    })
  },
  computed: {
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
      } else {
        return width * 0.9
      }
    }
  },
  methods: {
    onSearchBarFocused() {
      this.$emit('focus')
    }
  },
  watch: {
    searchInput(newVal) {
      search({
        query: newVal.trim(),
        type: 'domain',
        limit: 10,
        offset: 1
      }).then((res) => {
        this.domains.splice(0, this.domains.length)
        this.domains.push(...res.items)
      })
    }
  }
})
</script>
