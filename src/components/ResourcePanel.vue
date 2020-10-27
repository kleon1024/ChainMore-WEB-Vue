<template>
    <v-card>
      <v-list dense>
        <v-list-item>
          <v-list-item-title>
            <div> 最近收藏资源 </div>
          </v-list-item-title>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-plus"
              tip="添加资源"
              text
              icon
              x-small
              :to="{ path: '/op/create/resource' }"
            />
          </v-list-item-action>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-menu"
              tip="所有收藏"
              text
              icon
              x-small
              :to="{ path: '/person/resource'}"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-for="(resource, index) in resources" :key="index">
          <v-list-item-subtitle>
            <router-link :to="{ path: '/explore/resource/' + resource.id}">
              <div class='subtitle-2 text--primary'> {{ resource.title }} </div>
            </router-link>
          </v-list-item-subtitle>
          <v-list-item-action>
            <a
              target='_blank'
              :href="resource.url"
            >
              <TooltipIconButton
                str="mdi-link-variant"
                tip="打开链接"
                text
                icon
                x-small
              />
            </a>
          </v-list-item-action>
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
    resources: []
  }),
  mounted() {
    this.resources = PersonModule.resources.slice(0, 3)
  }
})
</script>
