<template>
  <div>
    <v-layout
      column
      justify-center
      align-center
      v-if="!isGroupCreated"
    >
      <v-row>
        <v-icon
          size="360"
          color="primary"
        >mdi-link-lock</v-icon>
      </v-row>
      <v-row>
        <v-card-title>
          你还没有开启行动计划
        </v-card-title>
      </v-row>
      <v-row>
        <v-btn
          text
          block
          color="primary"
          outlined
          @click="onClickOpenAction"
        >
          立即开启
        </v-btn>
      </v-row>
    </v-layout>
    <div v-if="isGroupCreated">
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
      <ActionView v-if="tab === 0" :group="group" />
      <ClusterManage v-if="tab === 1" :group="group"/>
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

export default Vue.extend({
  name: 'ResourcePanel',
  components: {
    ActionView,
    ClusterManage
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
        }
      ]
    }
  },
  methods: {
    onClickOpenAction() {
      PersonModule.CreateUserGroup()
    }
  },
  mounted() {
    GlobalModule.UpdateClusterTypes()
    PersonModule.UpdateUserGroup()
  },
  computed: {
    isGroupCreated() {
      return this.group.created
    },
    group() {
      if (!PersonModule.userGroup) {
        return {
          created: false,
          actions: []
        }
      }
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
