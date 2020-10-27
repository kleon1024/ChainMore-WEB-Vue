<template>
    <v-card>
      <v-list dense>
        <v-list-item>
          <v-list-item-title>
            <div> 最近收藏领域 </div>
          </v-list-item-title>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-plus"
              tip="创建领域"
              text
              icon
              x-small
              :to="{ path: '/op/create/domain' }"
            />
          </v-list-item-action>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-menu"
              tip="所有收藏"
              text
              icon
              x-small
              :to="{ path: '/person/domain'}"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-for="(domain, index) in domains" :key="index">
          <v-list-item-title>
          <router-link :to="{ path: '/explore/domain/' + domain.id}" >
              <div class='subtitle-2 text--primary'> {{ domain.title }} </div>
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
  name: 'ResourcePanel',
  components: {
    TooltipIconButton
  },
  data: () => ({
    domains: []
  }),
  mounted() {
    this.domains = PersonModule.domains.slice(0, 3)
  }
})
</script>
