<template>
  <div v-if="currentCluster">
    <v-flex style="overflow:auto">
      <v-layout>
        <v-col>
          <v-list dense min-height="80vh" min-width="150pt" elevation="2">
            <v-list-item>
              <v-btn outlined x-small color="grey">
                <span class="text--primary">未归类</span>
              </v-btn>
            </v-list-item>
            <draggable
              class="list-group"
              v-model="filteredActions[-1]"
              group="action"
              @start="onStartMoveAction(null)"
              @end="onEndMoveAction"
              @change="onActionChange"
            >
              <v-list-item class="list-group-item" v-for="action in filteredActions[-1]" :key="action.id">
                  {{ action.title }}
              </v-list-item>
            </draggable>
          </v-list>
        </v-col>
        <v-col v-for="attr in currentCluster.attrs" :key="attr.id">
          <v-list dense min-height="80vh" min-width="150pt" elevation="2">
            <v-list-item>
              <v-subheader class="pa-0">
                <v-btn outlined x-small :color="attrColor(attr.color)">
                  <span class="text--primary">{{ attr.text }}</span>
                </v-btn>
              </v-subheader>
            </v-list-item>
            <draggable
              class="list-group"
              v-model="filteredActions[attr.id]"
              group="action"
              @start="onStartMoveAction(attr)"
              @end="onEndMoveAction"
              @change="onActionChange"
            >
              <v-list-item
                class="list-group-item"
                v-for="action in filteredActions[attr.id]"
                :key="action.id"
              >
              {{ action.title }}
              </v-list-item>
            </draggable>
          </v-list>
        </v-col>
      </v-layout>
    </v-flex>
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import { PersonModule } from '@/store/modules/person'

export default Vue.extend({
  name: 'ActionList',
  components: {
    draggable
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentCluster: null,
      filteredActions: {},
      startLengths: {},
      operatingAttr: null,
      events: []
    }
  },
  methods: {
    attrColor(color) {
      if (color === undefined) return 'primary'
      return `#${color.toString(16)}`
    },
    filterActions() {
      this.filteredActions[-1] = []
      for (let i = 0; i < this.currentCluster.attrs.length; i++) {
        this.filteredActions[this.currentCluster.attrs[i].id] = []
      }
      let unmatched
      for (let i = 0; i < this.group.actions.length; i++) {
        unmatched = true
        for (let j = 0; j < this.group.actions[i].attrs.length; j++) {
          for (let k = 0; k < this.currentCluster.attrs.length; k++) {
            if (
              this.group.actions[i].attrs[j].id ===
              this.currentCluster.attrs[k].id
            ) {
              unmatched = false
              this.filteredActions[this.currentCluster.attrs[k].id].push(
                this.group.actions[i]
              )
            }
          }
        }
        if (unmatched) {
          this.filteredActions[-1].push(this.group.actions[i])
        }
      }
      for (const k in this.filteredActions) {
        this.filteredActions[k] = this.filteredActions[k].sort((a, b) => a.order - b.order)
      }
    },
    initCluster() {
      if (this.clusters.length > 0) {
        this.currentCluster = this.clusters[0]
        this.filterActions()
      }
    },
    onActionChange(evt) {
      this.events.push(evt)
    },
    onStartMoveAction(attr) {
      this.operatingAttr = attr
      this.events = []
      for (const k in this.filteredActions) {
        this.startLengths[k] = this.filteredActions[k].length
      }
    },
    onEndMoveAction() {
      let removedAttrId = -2
      let addedAttrId = -2
      for (const k in this.filteredActions) {
        if (this.startLengths[k] < this.filteredActions[k].length) {
          addedAttrId = parseInt(k)
        } else if (this.startLengths[k] > this.filteredActions[k].length) {
          removedAttrId = parseInt(k)
        }
      }

      let removedAttr, addedAttr
      for (let i = 0; i < this.currentCluster.attrs.length; i++) {
        if (this.currentCluster.attrs[i].id === removedAttrId) {
          removedAttr = this.currentCluster.attrs[i]
        }
        if (this.currentCluster.attrs[i].id === addedAttrId) {
          addedAttr = this.currentCluster.attrs[i]
        }
      }

      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i]
        if (event.added) {
          const action = event.added.element
          if (addedAttrId < 0) continue
          addedAttr.order = event.added.newIndex
          PersonModule.SetActionAttribute({
            group: this.group,
            action: action,
            attr: addedAttr,
            after: event.added.newIndex - 1,
            success: () => {
              this.filterActions()
            }
          })
        } else if (event.removed) {
          const action = event.removed.element
          if (removedAttrId < 0) continue
          PersonModule.UnsetActionAttribute({
            group: this.group,
            action: action,
            attr: removedAttr,
            success: () => {
              this.filterActions()
            }
          })
        } else if (event.moved) {
          const action = event.moved.element
          if (this.operatingAttr === null) continue
          const oldAttr = JSON.parse(JSON.stringify(this.operatingAttr))
          this.operatingAttr.order = event.moved.newIndex
          PersonModule.PutActionAttribute({
            group: this.group,
            action: action,
            attr: this.operatingAttr,
            oldAttr: oldAttr,
            after: event.moved.newIndex - 1,
            success: () => {
              this.filterActions()
            }
          })
        }
      }
      this.$forceUpdate()
    }
  },
  mounted() {
    this.initCluster()
  },
  computed: {
    clusters() {
      return this.group.clusters
    },
    actions() {
      return this.group.actions
    },
    actionMap() {
      return this.group.actionMap
    }
  }
})
</script>

<style scoped>
.list-group-item:hover {
  cursor: move
}
</style>
