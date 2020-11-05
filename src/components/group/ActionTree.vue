<template>
  <div>
    <v-toolbar
      elevation="0"
      dense
    >
      <TooltipIconButton
        str="mdi-format-list-bulleted"
        tip="平铺所有"
        text
        icon
        small
        @click="showMode = 1"
      />
    </v-toolbar>
    <ActionList v-if="showMode === 1"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'
import ActionList from '@/components/group/ActionList.vue'

export default Vue.extend({
  name: 'ActionTree',
  components: {
    TooltipIconButton,
    ActionList
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showMode: 1,
      items: [
        {
          title: 'A',
          active: false,
          action: 'mdi-plus',
          items: [
            {
              title: 'B',
              active: false,
              action: 'mdi-plus',
              items: [
                {
                  title: 'C',
                  active: false,
                  action: 'mdi-plus',
                  items: [
                    {
                      title: 'D',
                      active: false,
                      action: 'mdi-plus',
                      items: [

                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    PersonModule.UpdateUserGroup()
  },
  computed: {
    userGroup() {
      return PersonModule.userGroup
    }
  },
  watch: {
    // query(val) {
    //   this.searchedDomains.splice(0, this.searchedDomains.length)
    //   this.searchedDomains.push(
    //     ...searchQuery(val, PersonModule.domains,
    //       (r, q) => r.title.toLowerCase().includes(q) || r.intro.toLowerCase().includes(q)))
    // }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
