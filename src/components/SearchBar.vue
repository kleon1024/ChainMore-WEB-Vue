<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="3"
      />
      <v-col
        cols="12"
        sm="6"
      >
        <v-form @submit.native.prevent>
          <v-text-field
            v-model="searchInput"
            label="我想学"
            outlined
            @focus="onSearchBarFocused"
          ></v-text-field>
        </v-form>
        <DomainGroup :domains="domains" />
      </v-col>
      <v-col
        cols="12"
        sm="3"
      />
    </v-row>
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
    recDomains: [],
    searchInput: ''
  }),
  mounted() {
    getDomains().then((res) => {
      this.recDomains.splice(0, this.domains.length)
      this.recDomains.push(...res.items)
      this.domains.push(...this.recDomains)
    })
  },
  methods: {
    onSearchBarFocused() {
      this.$emit('focus')
    }
  },
  watch: {
    searchInput(newVal) {
      if (newVal.trim() !== '') {
        search({
          query: newVal.trim(),
          type: 'domain',
          limit: 10,
          offset: 1
        }).then((res) => {
          if (res.items.length === 0) {
            this.domains.splice(0, this.domains.length)
            this.domains.push({
              noResult: true,
              desc: '暂无匹配领域',
              query: newVal.trim()
            })
          } else {
            this.domains.splice(0, this.domains.length)
            this.domains.push(...res.items)
          }
        })
      } else {
        this.domains.splice(0, this.domains.length)
        this.domains.push(...this.recDomains)
      }
    }
  }
})
</script>
