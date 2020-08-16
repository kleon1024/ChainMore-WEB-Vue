<template>
  <v-container>
    <v-row class='text-center' align='center' justify='center'>
      <v-card elevation='0'>
        <svg
          v-if='data'
          :width='width'
          :height='data.layout.height'
          class='tangle-tree'
        >
          <g v-for='(b, index) in bundleDatas' :key='"bundle" + index'>
            <path class='link' :d='b' stroke='white' stroke-width='6' />
            <path class='link' :d='b' :stroke='pathColor(index)' stroke-width='3' />
          </g>
          <g v-for='(n, index) in data.nodes' :key='"node" + index'>
            <line
              class='node'
              stroke='black'
              stroke-width='8'
              :x1='n.x'
              :y1='n.y-n.height/2'
              :x2='n.x'
              :y2='n.y+n.height/2'
            />
            <line
              class='node'
              stroke='white'
              stroke-width='4'
              :x1='n.x'
              :y1='n.y-n.height/2'
              :x2='n.x '
              :y2='n.y+n.height/2'
            />
            <text :x='n.x+4' :y='n.y-n.height/2-4' stroke='white' stroke-width='2'>{{ n.id }}</text>
            <text :x='n.x+4' :y='n.y-n.height/2-4'>{{ n.id }}</text>
          </g>
        </svg>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import * as d3 from 'd3'
import { getDomainDepends, getDomainRootDepends } from '@/api/domains'

export default Vue.extend({
  name: 'DependCard',
  data: () => ({
    depends: [],
    rootDepends: [],
    data: null,
    levels: [
      [{ id: 'Chaos' }],
      [{ id: 'Gaea', parents: ['Chaos'] }, { id: 'Uranus' }]
    ]
  }),
  mounted() {
    this.loadData().then(() => {
      this.prepareData()
    })
  },
  computed: {
    width() {
      return 210 * this.levels.length
    },
    bundleDatas() {
      return this.data.bundles.map((b) =>
        b.links
          .map(
            (l) => `
              M${l.xt} ${l.yt}
              L${l.xb - l.c1} ${l.yt}
              A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
              L${l.xb} ${l.ys - l.c2}
              A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
              L${l.xs} ${l.ys}`
          )
          .join('')
      )
    }
  },
  methods: {
    color: d3.scaleOrdinal(d3.schemeDark2),
    pathColor(index) {
      return this.color(this.data.bundles[index].id)
    },
    loadData() {
      return new Promise((resolve) => {
        getDomainDepends({}).then((res) => {
          this.depends.push(...res.items)
          getDomainRootDepends().then((res) => {
            this.rootDepends.push(...res.items)
            this.genData()
            resolve(res)
          })
        })
      })
    },
    genData() {
      const nodeMap = {}
      const childNodeMap = {}
      this.depends.forEach((dep) => {
        if (dep.descendant.title in nodeMap) {
          if (!(dep.descendant.title in nodeMap[dep.descendant.title])) {
            nodeMap[dep.descendant.title].push(dep.ancestor.title)
          }
        } else {
          nodeMap[dep.descendant.title] = [dep.ancestor.title]
        }

        if (dep.ancestor.title in childNodeMap) {
          if (!(dep.ancestor.title in childNodeMap[dep.ancestor.title])) {
            childNodeMap[dep.ancestor.title].push(dep.ancestor.title)
          }
        } else {
          childNodeMap[dep.ancestor.title] = [dep.ancestor.title]
        }
      })

      const depthMap = {}
      this.rootDepends.forEach((dep) => {
        if (dep.distance in depthMap) {
          if (!depthMap[dep.distance].includes(dep.descendant.title)) {
            depthMap[dep.distance].push(dep.descendant.title)
          }
        } else {
          depthMap[dep.distance] = [dep.descendant.title]
        }
      })

      this.levels = []
      for (let depth = 0; depth < Object.keys(depthMap).length; depth++) {
        const level = []
        depthMap[depth].forEach((node) => {
          const parents = nodeMap[node]
          const children = childNodeMap[node]
          if (!(children === undefined && depth === 1)) {
            if (parents !== undefined) {
              level.push({
                id: node,
                parents: parents
              })
            } else {
              level.push({
                id: node
              })
            }
          }
        })
        this.levels.push(level)
      }
      // console.log(this.levels)
    },
    prepareData() {
      // precompute level depth
      const levels = this.levels

      levels.forEach((l, i) => l.forEach((n) => (n.level = i)))

      const nodes = levels.reduce((a, x) => a.concat(x), [])
      const nodes_index = {}
      nodes.forEach((d) => (nodes_index[d.id] = d))

      // objectification
      nodes.forEach((d) => {
        d.parents = (d.parents === undefined ? [] : d.parents).map(
          (p) => nodes_index[p]
        )
      })

      // precompute bundles
      levels.forEach((l, i) => {
        const index = {}
        l.forEach((n) => {
          if (n.parents.length === 0) {
            return
          }

          const id = n.parents
            .map((d) => d.id)
            .sort()
            .join('--')
          if (id in index) {
            index[id].parents = index[id].parents.concat(n.parents)
          } else {
            index[id] = { id: id, parents: n.parents.slice(), level: i }
          }
          n.bundle = index[id]
        })
        l.bundles = Object.keys(index).map((k) => index[k])
        l.bundles.forEach((b, i) => (b.i = i))
      })

      const links = []
      nodes.forEach((d) => {
        d.parents.forEach((p) =>
          links.push({ source: d, bundle: d.bundle, target: p })
        )
      })

      const bundles = levels.reduce((a, x) => a.concat(x.bundles), [])

      // reverse pointer from parent to bundles
      bundles.forEach((b) =>
        b.parents.forEach((p) => {
          if (p.bundles_index === undefined) {
            p.bundles_index = {}
          }
          if (!(b.id in p.bundles_index)) {
            p.bundles_index[b.id] = []
          }
          p.bundles_index[b.id].push(b)
        })
      )

      nodes.forEach((n) => {
        if (n.bundles_index !== undefined) {
          n.bundles = Object.keys(n.bundles_index).map(
            (k) => n.bundles_index[k]
          )
        } else {
          n.bundles_index = {}
          n.bundles = []
        }
        n.bundles.forEach((b, i) => (b.i = i))
      })

      links.forEach((l) => {
        if (l.bundle.links === undefined) {
          l.bundle.links = []
        }
        l.bundle.links.push(l)
      })

      // layout
      const padding = 8
      const node_height = 30
      const node_width = 150
      const bundle_width = 16
      const level_y_padding = 18
      const metro_d = 6
      const c = 20
      const min_family_height = 16

      nodes.forEach(
        (n) => (n.height = (Math.max(1, n.bundles.length) - 1) * metro_d)
      )

      let x_offset = padding
      let y_offset = padding
      levels.forEach((l) => {
        x_offset += l.bundles.length * bundle_width
        y_offset += level_y_padding
        l.forEach((n) => {
          n.x = n.level * node_width + x_offset
          n.y = node_height + y_offset + n.height / 2

          y_offset += node_height + n.height
        })
      })

      let i = 0
      levels.forEach((l) => {
        l.bundles.forEach((b) => {
          b.x =
            b.parents[0].x +
            node_width +
            (l.bundles.length - 1 - b.i) * bundle_width
          b.y = i * node_height
        })
        i += l.length
      })

      links.forEach((l) => {
        l.xt = l.target.x
        l.yt =
          l.target.y +
          l.target.bundles_index[l.bundle.id].i * metro_d -
          (l.target.bundles.length * metro_d) / 2 +
          metro_d / 2
        l.xb = l.bundle.x
        l.xs = l.source.x
        l.ys = l.source.y
      })

      // compress vertical space
      let y_negative_offset = 0
      levels.forEach((l) => {
        y_negative_offset +=
          -min_family_height +
            d3.min(l.bundles, (b) =>
              d3.min(b.links, (link) => link.ys - c - (link.yt + c))
            ) || 0
        l.forEach((n) => (n.y -= y_negative_offset))
      })

      // very ugly, I know
      links.forEach((l) => {
        l.yt =
          l.target.y +
          l.target.bundles_index[l.bundle.id].i * metro_d -
          (l.target.bundles.length * metro_d) / 2 +
          metro_d / 2
        l.ys = l.source.y
        l.c1 = l.source.level - l.target.level > 1 ? node_width + c : c
        l.c2 = c
      })

      const layout = {
        height: d3.max(nodes, (n) => n.y) + node_height / 2 + 2 * padding,
        node_height,
        node_width,
        bundle_width,
        level_y_padding,
        metro_d
      }

      this.data = { levels, nodes, nodes_index, links, bundles, layout }
    }
  }
})
</script>

<style>
.tangle-tree text {
  font-family: sans-serif;
  font-size: 15px;
}
.tangle-tree .node {
  stroke-linecap: round;
}
.tangle-tree .link {
  fill: none;
}
</style>
