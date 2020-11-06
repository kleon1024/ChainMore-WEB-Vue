<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              行动代号
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="action in actions"
            :key="action.id"
          >
            <td>{{ action.title }}</td>
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
    }
  },
  computed: {
    userGroup() {
      return PersonModule.userGroup.group
    },
    actions() {
      return PersonModule.userGroup.actions
    }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
