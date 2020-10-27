<template>
  <v-container fluid>
    <v-bottom-sheet v-model="showFilter">
      <v-list>
        <v-subheader class="mb-3"> 过滤资源 </v-subheader>
        <v-list-item>
          <v-combobox
            class="subtitle-2"
            v-model="resourceTypes"
            :items="allResourceTypes"
            item-text="title"
            item-value="id"
            label="资源类型"
            multiple
            chips
            dense
          >
              <template v-slot:selection="data">
                <v-chip
                  small
                  class="ma-2"
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  close
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.title }}
                </v-chip>
              </template>
          </v-combobox>
        </v-list-item>
        <v-list-item>
          <v-combobox
            class="subtitle-2"
            v-model="mediaTypes"
            :items="allMediaTypes"
            item-text="title"
            item-value="id"
            label="媒体类型"
            multiple
            chips
            dense
          >
              <template v-slot:selection="data">
                <v-chip
                  small
                  class="ma-2"
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  close
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.title }}
                </v-chip>
              </template>
          </v-combobox>
        </v-list-item>
        <!-- <v-list-item>
          <v-combobox
            class="subtitle-2"
            v-model="resourceTags"
            :items="allTags"
            item-text="title"
            item-value="id"
            label="标签"
            multiple
            chips
            dense
          >
              <template v-slot:selection="data">
                <v-chip
                  small
                  class="ma-2"
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  close
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.title }}
                </v-chip>
              </template>
          </v-combobox>
        </v-list-item> -->
        <div class="pa-5"></div>
      </v-list>
    </v-bottom-sheet>
    <v-card>
      <v-list dense>
        <v-list-item>
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
              str="mdi-filter-outline"
              tip="过滤资源"
              text
              icon
              x-small
              @click="showFilter = !showFilter"
            />
          </v-list-item-action>
        </v-list-item>
        <div
          v-if="mediaTypes.length > 0
          || resourceTags.length > 0
          || resourceTypes.length > 0">
          <v-chip
            v-for="(item, index) in mediaTypes"
            :key="`media${index}`"
            small
            class="ma-2"
            close
            @click:close="onCloseFilterChip('media', item)"
          >
            {{ item.title }}
          </v-chip>
          <v-chip
            v-for="(item, index) in resourceTypes"
            :key="`resource${index}`"
            small
            class="ma-2"
            close
            @click:close="onCloseFilterChip('resource', item)"
          >
            {{ item.title }}
          </v-chip>
          <v-chip
            v-for="(item, index) in resourceTags"
            :key="`tag${index}`"
            small
            class="ma-2"
            close
            @click:close="onCloseFilterChip('tag', item)"
          >
            {{ item.title }}
          </v-chip>
        </div>
        <v-list-item
          v-for="(resource, index) in finalResources"
          :key="index"
        >
          <v-list-item-title>
            <router-link :to="{path: '/explore/resource/' + resource.id}">
              <div class='body-2 font-weight-bold text--primary'> {{ resource.title }} </div>
              <div class='caption'> 收藏于 {{ readableTime(resource.star_time) }} </div>
            </router-link>
          </v-list-item-title>
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
  </v-container>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'

export default Vue.extend({
  name: 'PersonalResource',
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
    allResourceTypes: [
      {
        title: '讨论',
        type: 'article',
        id: 1
      }
    ],
    allMediaTypes: [
      {
        title: '文本',
        type: 'text',
        id: 1
      }
    ],
    allTags: [
      {
        title: '私人珍藏',
        id: 1
      }
    ],
    finalResources: [],
    searchedResources: [],
    searchInput: '',
    showFilter: false,
    mediaTypes: [],
    resourceTypes: [],
    resourceTags: []
  }),
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    arrayIn(array, element, callback) {
      if (array.length === 0) return true
      for (let i = 0; i < array.length; i++) {
        if (callback(array[i], element)) return true
      }
      return false
    },
    filterResource() {
      this.finalResources = this.searchedResources.filter(
        (r) => {
          return (
            this.arrayIn(this.mediaTypes, r, (a, r) => r.media_type_id === a.id) &&
            this.arrayIn(this.resourceTypes, r, (a, r) => r.resource_type_id === a.id)
          )
        }
      )
    },
    onCloseFilterChip(type, item) {
      if (type === 'media') {
        for (let i = 0; i < this.mediaTypes.length; i++) {
          if (this.mediaTypes[i].id === item.id) {
            this.mediaTypes.splice(i, 1)
            break
          }
        }
      } else if (type === 'resource') {
        for (let i = 0; i < this.resourceTypes.length; i++) {
          if (this.resourceTypes[i].id === item.id) {
            this.resourceTypes.splice(i, 1)
            break
          }
        }
      } else if (type === 'tag') {
        for (let i = 0; i < this.resourceTags.length; i++) {
          if (this.resourceTags[i].id === item.id) {
            this.resourceTags.splice(i, 1)
            break
          }
        }
      }
      this.filterResource()
    }
  },
  mounted() {
    this.searchedResources.push(...PersonModule.resources)
    this.finalResources = this.searchedResources
  },
  watch: {
    query(val) {
      this.searchedResources.splice(0, this.searchedResources.length)
      this.searchedResources.push(
        ...searchQuery(val, PersonModule.resources,
          (r, q) => r.title.toLowerCase().includes(q) || r.url.includes(q)))
    },
    showFilter(val) {
      if (val) return
      this.filterResource()
    }
  }
})
</script>
