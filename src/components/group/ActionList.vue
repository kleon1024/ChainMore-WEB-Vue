<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              行动代号
            </th>
            <th class="text-left" v-for="cluster in clusters" :key="cluster.id">
              {{ cluster.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="action in actions"
            :key="action.id"
          >
            <td>{{ action.title }}</td>
            <td v-for="cluster in clusters" :key="cluster.id">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    v-bind="attrs"
                    v-on="on"
                    left
                    x-small
                    v-if="cluster.attrs.length > 0"
                    class="pa-0"
                    :color="attrColor(actionAttribute(action, cluster).color)"
                  >
                    <v-icon small> mdi-chevron-down </v-icon>
                    {{ actionAttribute(action, cluster).text }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(attr, index) in cluster.attrs"
                    :key="index"
                    @click="onSetActionAttribute(action, cluster, attr)"
                  >
                    <v-list-item-content
                      class="subtitle-2"
                    >
                      {{ attr.text }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'

export default Vue.extend({
  name: 'ActionList',
  components: {},
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    attrColor(color) {
      if (color === undefined) return 'primary'
      return `#${color.toString(16)}`
    },
    actionAttribute(action, cluster) {
      for (let i = 0; i < action.attrs.length; i++) {
        const actionAttr = action.attrs[i]
        for (let j = 0; j < cluster.attrs.length; j++) {
          const clusterAttr = cluster.attrs[j]
          if (actionAttr.id === clusterAttr.id) {
            return actionAttr
          }
        }
      }
      return {
        text: ''
      }
    },
    onSetActionAttribute(action, cluster, attr) {
      const currentAttr = this.actionAttribute(action, cluster)
      if (currentAttr.id === undefined) {
        PersonModule.SetActionAttribute({
          action: action,
          attr: attr,
          group: this.userGroup
        })
      } else if (currentAttr.id !== attr.id) {
        PersonModule.ReplaceActionAttribute({
          action: action,
          attr: attr,
          oldAttr: currentAttr,
          group: this.userGroup
        })
      }
    }
  },
  computed: {
    userGroup() {
      return PersonModule.userGroup.group
    },
    actions() {
      return PersonModule.userGroup.actions
    },
    clusters() {
      return PersonModule.userGroup.clusters
    }
  }
})
</script>
