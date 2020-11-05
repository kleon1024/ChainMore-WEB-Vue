<template>
    <div>
        <v-btn
          text
          outlined
          block
          color="primary"
        >
          添加事项
        </v-btn>
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
      return PersonModule.userGroup
    }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
