<template>
  <v-container fluid>
    <v-bottom-sheet v-model="showFilter">
      <v-list>
        <v-subheader class="mb-3"> 过滤资源 </v-subheader>
        <v-list-item>
          <v-autocomplete
            class="subtitle-2"
            v-model="resourceTypes"
            :items="allResourceTypes"
            item-text="name_zh_cn"
            item-value="id"
            label="资源类型"
            hide-selected
            multiple
            chips
            dense
          >
              <template v-slot:selection="data">
                <v-chip
                  small
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  close
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.name_zh_cn }}
                </v-chip>
              </template>
          </v-autocomplete>
        </v-list-item>
        <v-list-item>
          <v-autocomplete
            class="subtitle-2"
            v-model="mediaTypes"
            :items="allMediaTypes"
            item-text="name_zh_cn"
            item-value="id"
            label="媒体类型"
            hide-selected
            multiple
            chips
            dense
          >
              <template v-slot:selection="data">
                <v-chip
                  small
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  close
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.name_zh_cn }}
                </v-chip>
              </template>
          </v-autocomplete>
        </v-list-item>
        <v-list-item>
          <v-autocomplete
            class="subtitle-2"
            v-model="resourceTags"
            :items="allTags"
            item-text="title"
            item-value="id"
            label="标签"
            hide-selected
            multiple
            chips
            dense
          >
              <template v-slot:selection="data">
                <v-chip
                  small
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
          </v-autocomplete>
        </v-list-item>
        <div class="pa-8"></div>
      </v-list>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="showTagMange">
      <v-list>
        <v-subheader class="mb-3"> 资源标签 </v-subheader>
        <v-list-item>
        <v-combobox
          v-model="comboboxSelectedTags"
          :items="comboboxResourceTags"
          :search-input.sync="search"
          item-text="title"
          item-value="id"
          hide-selected
          multiple
          close
          dense
          small-chips
        >
          <template v-slot:selection="data">
            <v-chip
              x-small
              class="ma-1"
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              close
              @click:close="onCloseTagChip(data)"
            >
              {{ data.item.title || data.item }}
            </v-chip>
          </template>
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="subtitle-2">
                  {{ comboboxHint() }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
        </v-list-item>
        <div class="pa-8"></div>
      </v-list>
    </v-bottom-sheet>
    <v-card>
      <v-list dense>
        <v-list-item>
          <v-subheader class="pl-0">资源管理</v-subheader>
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
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-tag-multiple-outline"
              :tip="showTag ? '隐藏标签' : '显示标签'"
              text
              icon
              x-small
              @click="onClickShowTagButton"
            />
          </v-list-item-action>
        </v-list-item>
        <div
          class="pl-2"
          v-if="filterMediaTypes.length > 0
          || filterResourceTypes.length > 0
          || filterResourceTags.length > 0"
        >
          <v-chip
            v-for="(item, index) in filterMediaTypes"
            :key="`media${index}`"
            small
            class="ma-2"
            close
            @click:close="onCloseFilterChip('media', item)"
          >
            {{ getMediaTypeName(item) }}
          </v-chip>
          <v-chip
            v-for="(item, index) in filterResourceTypes"
            :key="`resource${index}`"
            small
            class="ma-2"
            close
            @click:close="onCloseFilterChip('resource', item)"
          >
            {{ getResourceTypeName(item) }}
          </v-chip>
          <v-chip
            v-for="(item, index) in filterResourceTags"
            :key="`tag${index}`"
            small
            class="ma-2"
            close
            @click:close="onCloseFilterChip('tag', item)"
          >
            {{ getResourceTagName(item) }}
          </v-chip>
        </div>
        <v-virtual-scroll
          :bench="benched"
          :items="finalResources"
          height="dynamic"
          max-height="600"
          :item-height="getResourceHeight()"
        >
          <template v-slot:default="{ item }">
            <v-list-item
              :key="`title${item.id}`"
              id="resource-body"
            >
              <v-list-item-title>
                <router-link :to="{path: '/explore/resource/' + item.id}">
                  <div class='body-2 font-weight-bold text--primary'> {{ item.title }} </div>
                  <div class='caption'> 收藏于 {{ readableTime(item.star_time) }} </div>
                </router-link>
              </v-list-item-title>
              <v-list-item-action>
                <a
                  target='_blank'
                  :href="item.url"
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
              <v-list-item-action v-if="showTag">
                  <TooltipIconButton
                    str="mdi-tag-plus-outline"
                    tip="管理标签"
                    text
                    icon
                    x-small
                    @click="setEditingTags(item)"
                  />
              </v-list-item-action>
            </v-list-item>
            <div v-if="showTag" :key="`tag${item.id}`" class="mx-3">
              <v-chip-group
                center-active
                active-class="primary--text"
              >
                <v-chip
                  v-for="(tag, i) in item.tags"
                  :key="`tag${i}`"
                  x-small
                  :close="showRemoveResourceTag"
                  class="caption"
                >
                  {{ toTag(tag).title }}
                </v-chip>
              </v-chip-group>
            </div>
            <!-- <v-list-item v-if="editingResourceTag === item.id" :key="`tagcombobox${item.id}`" id="tag-edit">
              <v-list-item-title>
              <v-combobox
                v-model="comboboxSelectedTags"
                :items="comboboxResourceTags"
                :search-input.sync="search"
                item-text="title"
                item-value="id"
                hide-selected
                multiple
                close
                dense
                small-chips
              >
                <template v-slot:selection="data">
                  <v-chip
                    x-small
                    class="ma-1"
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    close
                    @click:close="onCloseTagChip(data)"
                  >
                    {{ data.item.title || data.item }}
                  </v-chip>
                </template>
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="subtitle-2">
                        {{ comboboxHint() }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
              </v-list-item-title>
              <v-list-item-action>
              <v-btn
                class="ml-3"
                text
                x-small
                @click="onCompleteEditTag">
                完成
              </v-btn>
              </v-list-item-action>
            </v-list-item> -->
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { GlobalModule } from '@/store/modules/global'
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
  computed: {
    allResourceTypes() {
      return GlobalModule.resourceItems
    },
    allMediaTypes() {
      return GlobalModule.mediaItems
    },
    allTags() {
      return PersonModule.resourceTags
    }
  },
  data: () => ({
    showTag: true,
    showTagMange: false,
    search: '',
    benched: 24,
    showRemoveResourceTag: false,
    comboboxResourceTags: [],
    comboboxSelectedTags: [],
    comboboxTagNum: 0,
    editingResourceTag: -1,
    finalResources: [],
    searchedResources: [],
    searchInput: '',
    showFilter: false,
    mediaTypes: [],
    resourceTypes: [],
    resourceTags: [],
    filterMediaTypes: [],
    filterResourceTypes: [],
    filterResourceTags: []
  }),
  methods: {
    getMediaTypeName(id) {
      return GlobalModule.mediaTypeMap[id].name_zh_cn
    },
    getResourceTypeName(id) {
      return GlobalModule.resourceTypeMap[id].name_zh_cn
    },
    getResourceTagName(id) {
      return PersonModule.resourceTags[id].title
    },
    getResourceHeight() {
      let height = 48
      if (this.showTag) {
        height += 32
      }
      return height
    },
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
      this.filterMediaTypes = []
      this.filterMediaTypes.push(...this.mediaTypes)

      this.filterResourceTypes = []
      this.filterResourceTypes.push(...this.resourceTypes)

      this.filterResourceTags = []
      this.filterResourceTags.push(...this.resourceTags)

      this.finalResources = this.searchedResources.filter(
        (r) => {
          return (
            this.arrayIn(this.mediaTypes, r, (a, r) => r.media_type_id === a) &&
            this.arrayIn(this.resourceTypes, r, (a, r) => r.resource_type_id === a) &&
            this.arrayIn(this.resourceTags, r, (a, r) => r.tags.includes(a))
          )
        }
      )

      for (let i = 0; i < this.finalResources.length; i++) {
        this.finalResources[i].index = i
      }
    },
    onCloseFilterChip(type, item) {
      if (type === 'media') {
        for (let i = 0; i < this.mediaTypes.length; i++) {
          if (this.mediaTypes[i] === item) {
            this.mediaTypes.splice(i, 1)
            break
          }
        }
      } else if (type === 'resource') {
        for (let i = 0; i < this.resourceTypes.length; i++) {
          if (this.resourceTypes[i] === item) {
            this.resourceTypes.splice(i, 1)
            break
          }
        }
      } else if (type === 'tag') {
        for (let i = 0; i < this.resourceTags.length; i++) {
          if (this.resourceTags[i] === item) {
            this.resourceTags.splice(i, 1)
            break
          }
        }
      }
      this.filterResource()
    },
    onCompleteEditTag() {
      this.filterResource()
      this.editingResourceTag = -1
      this.showTagMange = false
    },
    setEditingTags(item) {
      if (this.editingResourceTag !== -1) {
        this.onCompleteEditTag()
      }
      let resource
      for (let i = 0; i < this.finalResources.length; i++) {
        if (this.finalResources[i].id === item.id) {
          resource = this.finalResources[i]
          break
        }
      }
      this.comboboxResourceTags = PersonModule.resourceTags

      this.comboboxSelectedTags = []
      for (let i = 0; i < resource.tags.length; i++) {
        this.comboboxSelectedTags.push(PersonModule.resourceTagMap[resource.tags[i]])
      }

      this.comboboxTagNum = this.comboboxSelectedTags.length

      this.editingResourceTag = item.id
      this.showTagMange = true
    },
    toTag(index) {
      return PersonModule.resourceTagMap[index]
    },
    comboboxHint() {
      if (this.search !== null && this.search !== '') {
        return '没有找到这个标签，按回车或确认键立即创建'
      } else if (this.comboboxResourceTags.length === 0) {
        return '还没有创建任何标签，直接输入创建标签'
      } else if (this.comboboxSelectedTags.length === this.comboboxResourceTags.length) {
        return '已添加所有已有标签'
      } else {
        return '发生了什么？'
      }
    },
    onCloseTagChip(data) {
      data.parent.selectItem(data.item)
      this.comboboxTagNum = this.comboboxSelectedTags.length
      if (data.item.id) {
        let currentResource
        for (let i = 0; i < this.finalResources.length; i++) {
          if (this.finalResources[i].id === this.editingResourceTag) {
            currentResource = this.finalResources[i]
          }
        }
        PersonModule.UnstickResourceTag({
          resource: currentResource.id,
          tag: data.item.id,
          callback: (resource) => {
            for (let i = 0; i < this.finalResources.length; i++) {
              if (this.finalResources[i].id === resource.id) {
                this.finalResources[i] = resource
              }
            }

            for (let i = 0; i < this.searchedResources.length; i++) {
              if (this.searchedResources[i].id === resource.id) {
                this.searchedResources[i] = resource
              }
            }
          }
        })
      }
    },
    onClickShowTagButton() {
      this.showTag = !this.showTag
      this.editingResourceTag = -1
    }
  },
  mounted() {
    this.searchedResources.push(...PersonModule.resources)
    this.finalResources = this.searchedResources
  },
  watch: {
    query(val) {
      this.searchedResources = []
      this.searchedResources.push(
        ...searchQuery(val, PersonModule.resources,
          (r, q) => r.title.toLowerCase().includes(q) || r.url.includes(q)))
      this.filterResource()
    },
    showFilter(val) {
      if (val) return
      this.filterResource()
    },
    comboboxSelectedTags(val) {
      if (this.editingResourceTag !== -1) {
        if (this.comboboxSelectedTags.length > this.comboboxTagNum) {
          this.comboboxTagNum = this.comboboxSelectedTags.length
          const resourceTag = this.comboboxSelectedTags[this.comboboxSelectedTags.length - 1]
          if (resourceTag.id !== undefined) {
            let currentResource
            for (let i = 0; i < this.finalResources.length; i++) {
              if (this.finalResources[i].id === this.editingResourceTag) {
                currentResource = this.finalResources[i]
              }
            }
            PersonModule.StickResourceTag({
              resource: currentResource.id,
              tag: resourceTag.id,
              callback: (resource) => {
                console.log(resource)
                for (let i = 0; i < this.finalResources.length; i++) {
                  if (this.finalResources[i].id === resource.id) {
                    this.finalResources[i] = resource
                  }
                }

                for (let i = 0; i < this.searchedResources.length; i++) {
                  if (this.searchedResources[i].id === resource.id) {
                    this.searchedResources[i] = resource
                  }
                }
              }
            })
          } else {
            PersonModule.CreateResourceTag({
              title: resourceTag,
              resourceId: this.finalResources[this.editingResourceTag].id,
              callback: (resource, tag) => {
                for (let i = 0; i < this.finalResources.length; i++) {
                  if (this.finalResources[i].id === resource.id) {
                    this.finalResources[i] = resource
                  }
                }

                for (let i = 0; i < this.searchedResources.length; i++) {
                  if (this.searchedResources[i].id === resource.id) {
                    this.searchedResources[i] = resource
                  }
                }

                for (let i = 0; i < this.comboboxSelectedTags.length; i++) {
                  if (this.comboboxSelectedTags[i] === tag.title) {
                    this.comboboxSelectedTags[i] = tag
                  }
                }
              }
            })
          }
        }
      }
    }
  }
})
</script>
