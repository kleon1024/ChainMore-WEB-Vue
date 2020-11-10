<template>
  <tr>
    <td>
      <v-btn
        icon
        @click="clickExpand"
        v-if="expandable"
        x-small
      >
        <v-icon small v-if="action.expandable">
          {{ actionIcon }}
        </v-icon>
      </v-btn>
      {{ action.title }}
    </td>
    <td
      v-for="cluster in clusters"
      :key="cluster.id"
    >
      <v-menu
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            x-small
            class="px-1"
            v-if="cluster.attrs.length > 0"
            :color="attrColor(actionAttribute(action, cluster).color)"
            outlined
          >
            <v-icon small class="ma-0"> mdi-chevron-down </v-icon>
            <span class="text--primary"> {{ actionAttribute(action, cluster).text }} </span>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(attr, index) in cluster.attrs"
            :key="index"
          >
              <v-btn
                outlined
                x-small
                :color="attrColor(attr.color)"
                @click="onSetActionAttribute(action, cluster, attr)"
              >
                <span class="text--primary"> {{ attr.text }} </span>
              </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </td>
  </tr>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ActionList',
  components: {},
  props: {
    action: {
      type: Object,
      required: false
    },
    group: {
      type: Object,
      required: true
    },
    expandable: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
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
          group: this.group
        })
      } else if (currentAttr.id !== attr.id) {
        PersonModule.SetActionAttribute({
          action: action,
          attr: attr,
          group: this.group
        })
        PersonModule.UnsetActionAttribute({
          action: action,
          attr: currentAttr,
          group: this.group
        })
      }
    },
    clickExpand() {
      this.action.expanded = !this.action.expanded
      this.$emit('expand')
    }
  },
  computed: {
    actions() {
      return this.group.actions
    },
    clusters() {
      return this.group.clusters
    },
    actionIcon() {
      return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
    }
  }
})
</script>
