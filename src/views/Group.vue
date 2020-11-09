<template>
  <div>
    <div>
      <v-tabs
        v-model="tab"
        active-center
      >
        <v-tab
          v-for="(tab, index) in tabs"
          :key="index"
          dense
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>
      <ActionView
        v-if="tab === 0"
        :group="group()"
      />
      <ClusterManage
        v-if="tab === 1"
        :group="group()"
      />
      <MemberManage
        v-if="tab === 2"
        :group="group()"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { GlobalModule } from '@/store/modules/global'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import ActionView from '@/components/group/ActionView.vue'
import ClusterManage from '@/components/group/ClusterManage.vue'
import MemberManage from '@/components/group/MemberMange.vue'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {
    ActionView,
    ClusterManage,
    MemberManage
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {
          name: '行动项目'
        },
        {
          name: '行动蓝图'
        },
        {
          name: '成员管理'
        }
      ]
    }
  },
  mounted() {
    GlobalModule.UpdateClusterTypes()
    PersonModule.UpdateGroupDetail({
      group: this.group()
    })
  },
  methods: {
    group() {
      return PersonModule.groupMap[parseInt(this.$route.params.id)]
    }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
