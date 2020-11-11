<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              行动代号
            </th>
            <th
              class="text-left"
              v-for="cluster in clusters"
              :key="cluster.id"
            >
              {{ cluster.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <ActionRow
            v-for="action in actions()"
            :key="action.id"
            :group="group"
            :action="action"
            :expanded="action.expanded"
            :expandable="expandable"
            @expand="initActions(action)"
          />
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Vue from 'vue'
import ActionRow from '@/components/group/ActionRow.vue'

export default Vue.extend({
  name: 'ActionList',
  components: {
    ActionRow
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    expandable: {
      type: Boolean,
      default: false
    },
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      expandActions: []
    }
  },
  methods: {
    expandActionTree(actions, ret, level) {
      for (let i = 0; i < actions.length; i++) {
        const actionInstance = this.group.actionMap[actions[i].id]
        actionInstance.expandable = actions[i].children.length > 0
        actionInstance.level = level
        ret.push(actionInstance)
        if (actionInstance.expanded) {
          this.expandActionTree(actions[i].children, ret, level + 1)
        }
      }
    },
    initActions() {
      if (this.expandable) {
        const actions = []
        this.expandActionTree(this.group.actionTree.children, actions, 0)
        this.expandActions = actions
      }
    },
    actions() {
      if (!this.expandable) {
        return this.group.actions
      } else {
        return this.expandActions
      }
    }
  },
  mounted() {
    return this.initActions()
  },
  computed: {
    clusters() {
      return this.group.clusters
    },
    action() {
      return this.group.actions
    }
  },
  watch: {
    expandable(val) {
      this.initActions()
    },
    action(val) {
      this.initActions()
    }
  }
})
</script>
