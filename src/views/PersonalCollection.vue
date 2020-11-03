<template>
  <v-container fluid>
    <v-card>
      <v-list dense>
        <v-list-item>
          <v-subheader class="pl-0">合集</v-subheader>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-plus"
              tip="发布集合"
              text
              icon
              x-small
              :to="{ path: '/op/create/collection' }"
            />
          </v-list-item-action>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-clock-outline"
              tip="收藏时间"
              text
              icon
              x-small
              @click="showTime = !showTime"
            />
          </v-list-item-action>
          <v-list-item-action>
          </v-list-item-action>
        </v-list-item>
        <DynamicScroller
          :items="searchedCollections"
          :min-item-size="32"
          class="scroller"
        >
          <template v-slot:default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              :size-dependencies="[]"
            >
              <v-list-item>
                <v-list-item-title>
                  <router-link :to="{ path: `/explore/collection/${item.id}`}">
                    <div class='font-weight-bold text--primary text-truncate body-2 text--primary'> {{ item.title }} </div>
                    <div v-if="showTime" class='caption'> 收藏于 {{ readableTime(item.collect_time) }} </div>
                  </router-link>
                </v-list-item-title>
                <v-list-item-action>
                </v-list-item-action>
              </v-list-item>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'

export default Vue.extend({
  name: 'PersonalCollection',
  components: {
    TooltipIconButton
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    searchedCollections: [],
    searchInput: '',
    showTime: false
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    this.searchedCollections.push(...PersonModule.collections)
    document.title = '收藏领域 - 阡陌'
  },
  watch: {
    query(val) {
      this.searchedCollections.splice(0, this.searchedCollections.length)
      this.searchedCollections.push(
        ...searchQuery(val, PersonModule.collections,
          (r, q) => r.title.toLowerCase().includes(q) || r.description.includes(q)))
    }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
