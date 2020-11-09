<template>
  <v-card>
    <v-list dense>
      <v-list-item>
        <v-list-item-title>
          <div> 最近收藏合集 </div>
        </v-list-item-title>
        <v-list-item-action>
          <TooltipIconButton
            str="mdi-plus"
            tip="发布合集"
            text
            icon
            x-small
            :to="{ path: '/op/create/collection' }"
          />
        </v-list-item-action>
        <v-list-item-action>
          <TooltipIconButton
            str="mdi-menu"
            tip="所有收藏"
            text
            icon
            x-small
            :to="{ path: '/person/collection'}"
          />
        </v-list-item-action>
      </v-list-item>
      <v-list-item
        v-for="(collection, index) in collections"
        :key="index"
      >
        <v-list-item-title>
          <router-link
            :to="{ path: '/explore/collection/' + collection.id}"
          >
            <div class='subtitle-2 text--primary'> {{ collection.title }} </div>
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
  name: 'CollectionPanel',
  components: {
    TooltipIconButton
  },
  computed: {
    collections() {
      return PersonModule.collections.slice(0, 3)
    }
  }
})
</script>
