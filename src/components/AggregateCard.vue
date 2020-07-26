<template>
  <v-container>
    <v-row class='text-center' align='center' justify='center'>
      <v-card elevation='0'>
        <svg width='960' height='960' />
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import * as d3 from 'd3'
import { getDomainAggregates } from '@/api/domains'
import { drawRadicalDendrogram, buildHierarchyData } from '@/utils/d3utils'

export default Vue.extend({
  name: 'AggregateCard',
  data: () => ({
    depends: [],
    arc: {
      name: 'infinity',
      children: [
        {
          name: 'a',
          value: 123
        },
        {
          name: 'b',
          value: 1245,
          children: [
            {
              name: 'c',
              value: 1234
            }
          ]
        }
      ]
    }
  }),
  mounted() {
    this.loadData().then(() => {
      this.genData()
      this.initArc()
    })
  },
  methods: {
    loadData() {
      return new Promise((resolve) => {
        getDomainAggregates({}).then((res) => {
          this.depends.push(...res.items)
          resolve(res)
        })
      })
    },
    genData() {
      this.arc = buildHierarchyData(this.depends)[1]
    },
    initArc() {
      const svg = d3.select('svg')
      drawRadicalDendrogram(svg, this.arc)
    }
  }
})
</script>
