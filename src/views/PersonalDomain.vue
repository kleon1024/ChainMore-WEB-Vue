<template>
  <v-container fluid>
    <v-card>
      <v-list dense>
        <v-list-item>
          <v-subheader class="pl-0">领域</v-subheader>
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
          :items="searchedDomains"
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
                <router-link :to="{ path: `/explore/domain/${item.id}`}">
                  <div class='body-2 font-weight-bold text--primary text-truncate'> {{ item.title }} </div>
                  <div v-if="showTime" class='caption'> 收藏于 {{ readableTime(item.mark_time) }} </div>
                </router-link>
              </v-list-item-title>
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
  name: 'ResourcePanel',
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
    searchedDomains: [],
    searchInput: '',
    showTime: false
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  mounted() {
    this.searchedDomains.push(...PersonModule.domains)
  },
  watch: {
    query(val) {
      this.searchedDomains.splice(0, this.searchedDomains.length)
      this.searchedDomains.push(
        ...searchQuery(val, PersonModule.domains,
          (r, q) => r.title.toLowerCase().includes(q) || r.intro.toLowerCase().includes(q)))
    }
  }
})
</script>

<style scoped>
.scroller {
  max-height: 600px;
}
</style>
