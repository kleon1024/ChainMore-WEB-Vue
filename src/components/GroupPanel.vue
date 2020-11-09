<template>
    <v-card>
      <v-list dense>
        <v-list-item>
          <v-list-item-title>
            <div> 我的团队 </div>
          </v-list-item-title>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-plus"
              tip="创建团队"
              text
              icon
              x-small
              :to="{ path: '/op/create/group' }"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-for="(group, index) in groups" :key="index">
          <v-list-item-title>
          <router-link :to="{ path: '/person/group/' + group.group.id}" >
              <div class='subtitle-2 text--primary'> {{ group.group.title }} </div>
          </router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'

export default Vue.extend({
  name: 'GroupPanel',
  components: {
    TooltipIconButton
  },
  computed: {
    groups() {
      return Object.values(PersonModule.groupMap)
    }
  }
})
</script>
