<template>
  <v-container fluid>
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
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>
      <ActionTree v-if="tab === 0" />
    </div>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import ActionTree from '@/components/group/ActionTree.vue'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {
    ActionTree
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {
          name: '行动项目'
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
    PersonModule.UpdateUserGroup()
  },
  computed: {
    isGroupCreated() {
      return PersonModule.userGroup.created
    }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
