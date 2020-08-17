<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        :elevation="0"
        :width="width()"
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
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
      } else {
        return width * 0.9
      }
    },
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
