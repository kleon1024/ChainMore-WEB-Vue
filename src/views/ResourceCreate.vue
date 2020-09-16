<template>
  <v-container
    fluid
    fill-height
  >
    <v-row
      align='center'
      justify='center'
    >
      <v-card :width="width">
        <v-card-text>
          <p class='display-1 text--primary'> {{ title }}资源 </p>
          <v-card-actions v-if="urlExist">
            <router-link :to="'/resource/' + foundResource.id" class="d-inline-block text-truncate">
              {{ foundResource.title }}
            </router-link>
            <v-spacer/>
            <v-btn fab small text @click="starFoundResource">
              <v-icon
                color="teal"
              > {{ loginIcon() }} </v-icon>
            </v-btn>
          </v-card-actions>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="form.url"
              :counter="urlCount"
              :rules="rules.url"
              label="Url"
              outlined
              dense
              required
              @blur="checkUrl"
            ></v-text-field>
            <v-text-field
              v-model="form.title"
              :counter="titleCount"
              :rules="rules.title"
              label="标题"
              outlined
              dense
              required
              @blur="checkUrl"
            ></v-text-field>
            <v-select
              :items="resourceItems"
              label="资源类型"
              item-text="name"
              item-value="id"
              outlined
              v-model="form.resourceTypeId"
            >
            </v-select>
            <v-select
              :items="mediaItems()"
              item-text="name"
              item-value="id"
              label="媒体类型"
              outlined
              v-model="form.mediaTypeId"
            >
            </v-select>
            <v-row class="padding-horizontal">
              <p class="subheading font-weight-bold"> {{ combinedName() }} </p>
            </v-row>
            <v-row class="padding-horizontal">
              <v-checkbox
                v-model="form.paid"
                hide-details
                label="付费内容"
                class="shrink mr-2 mt-0"
              ></v-checkbox>
            </v-row>
            <p> </p>
            <v-btn
              block
              outlined
              color="primary"
              @click="submit"
            >
              {{ title }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { getResourceType } from '@/api/main'
import {
  checkUrlExsit,
  createResource,
  starResource,
  unstarResource,
  isStarResource,
  getResource,
  modifyResource
} from '@/api/resources'

export default Vue.extend({
  name: 'ResourceCreate',
  data() {
    return {
      valid: true,
      resource: null,
      urlCount: 512,
      titleCount: 128,
      form: {
        title: '',
        url: '',
        mediaTypeId: 1,
        resourceTypeId: 1,
        paid: false
      },
      urlExist: false,
      foundResource: null,
      urlStared: false,
      staring: false,
      rules: {
        url: [
          (v) => !!v.trim() || 'Url不能为空',
          (v) => (v && v.length <= this.urlCount) || 'Url必须小于512个字符',
          (v) => (v && v.startsWith('http')) || 'Url不合法',
          (v) => !this.urlExist || 'Url已存在'
        ],
        title: [
          (v) => !!v.trim() || '标题不能为空',
          (v) => (v && v.length <= this.titleCount) || '标题必须小于64个字符'
        ]
      },
      types: [],
      typeMap: {},
      resourceNameMap: {},
      mediaNameMap: {},
      resourceItems: [],
      resourceName: {
        article: '讨论',
        course: '课程',
        book: '书籍',
        tutorial: '教程/步骤',
        research: '研究',
        share: '分享',
        art: '艺术作品'
      },
      mediaName: {
        text: '文字',
        image: '图片',
        audio: '音频',
        video: '视频'
      },
      resourceMediaName: {
        articleAtext: '文章',
        articleAimage: '图文',
        articleAaudio: '录音/播客',
        articleAvideo: '演讲/表达',
        courseAtext: '文字课程',
        courseAimage: '图文课程',
        courseAaudio: '音频课程',
        courseAvideo: '视频教程/慕课',
        bookAtext: '文字为主的书',
        bookAimage: '视觉作品集/图片为主的书',
        bookAaudio: '有声书/嵌入音频为主的书',
        bookAvideo: '嵌入视频为主的书',
        tutorialAtext: '文字教程',
        tutorialAimage: '图文教程',
        tutorialAaudio: '音频教程',
        tutorialAvideo: '视频教程',
        researchAtext: '期刊会议论文',
        researchAimage: '研究引用图片',
        researchAaudio: '研究引用音频',
        researchAvideo: '研究引用视频',
        artAtext: '文学',
        artAimage: '静态视觉艺术',
        artAaudio: '音乐/声音艺术',
        artAvideo: '电影/纪录片/动画',
        shareAtext: '文本为主',
        shareAimage: '图像为主',
        shareAaudio: '音频为主',
        shareAvideo: '视频为主'
      }
    }
  },
  mounted() {
    this.loadResource()
    this.loadType()
  },
  methods: {
    starFoundResource() {
      if (!this.staring) {
        this.staring = true
        if (this.urlStared) {
          unstarResource({ id: this.foundResource.id }).then((res) => {
            if (res.items.length === 1) {
              this.urlStared = false
            }
            this.staring = false
          })
        } else {
          starResource({ id: this.foundResource.id }).then((res) => {
            if (res.items.length === 1) {
              this.urlStared = true
            }
            this.staring = false
          })
        }
      }
    },
    loginIndicator() {
      if (this.urlStared) {
        return '已收藏'
      } else {
        return '收藏'
      }
    },
    loginIcon() {
      if (this.urlStared) {
        return 'mdi-star'
      } else {
        return 'mdi-star-outline'
      }
    },
    loadResource() {
      if (!this.modify) {
        if (this.$route.query.url) {
          this.form.url = this.$route.query.url
        }
        if (this.$route.query.title) {
          this.form.title = this.$route.query.title
        }
        this.checkUrl()
        return
      }
      getResource({ id: this.$route.query.id }).then((res) => {
        if (res.items.length === 1) {
          this.resource = res.items[0]
          this.form.url = this.resource.url
          this.form.title = this.resource.title
          this.form.paid = !this.resource.free
          this.form.resourceTypeId = this.resource.resource_type_id
          this.form.mediaTypeId = this.resource.media_type_id
        }
      })
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.modify) {
          modifyResource({
            id: this.resource.id,
            url: this.form.url,
            title: this.form.title,
            external: true,
            free: !this.form.paid,
            resource_type_id: this.form.resourceTypeId,
            media_type_id: this.form.mediaTypeId
          }).then((res) => {
            if (res.items.length === 1) {
              const resource = res.items[0]
              starResource({
                id: resource.id
              }).then((res) => {
                this.$router.back()
              })
            }
          })
        } else {
          createResource({
            url: this.form.url,
            title: this.form.title,
            external: true,
            free: !this.form.paid,
            resource_type_id: this.form.resourceTypeId,
            media_type_id: this.form.mediaTypeId
          }).then((res) => {
            if (res.items.length === 1) {
              const resource = res.items[0]
              starResource({
                id: resource.id
              }).then((res) => {
                this.$router.back()
              })
            }
          })
        }
      }
    },
    mediaItems() {
      return this.typeMap[this.form.resourceTypeId]
    },
    combinedName() {
      const resourceName = this.resourceNameMap[this.form.resourceTypeId]
      const mediaName = this.mediaNameMap[this.form.mediaTypeId]
      return (
        this.resourceName[resourceName] +
        ' + ' +
        this.mediaName[mediaName] +
        ' = ' +
        this.resourceMediaName[resourceName + 'A' + mediaName]
      )
    },
    loadType() {
      getResourceType({}).then((res) => {
        this.types.push(...res.items)
        this.types.forEach((type) => {
          if (type.resource_id in this.typeMap) {
            this.typeMap[type.resource_id].push({
              id: type.media_id,
              name: this.mediaName[type.media_name]
            })
          } else {
            this.resourceItems.push({
              id: type.resource_id,
              name: this.resourceName[type.resource_name]
            })
            this.typeMap[type.resource_id] = [
              {
                id: type.media_id,
                name: this.mediaName[type.media_name]
              }
            ]
          }
          if (!(type.resource_id in this.resourceNameMap)) {
            this.resourceNameMap[type.resource_id] = type.resource_name
          }
          if (!(type.media_id in this.mediaNameMap)) {
            this.mediaNameMap[type.media_id] = type.media_name
          }
        })
      })
    },
    checkUrl() {
      if (this.resource && this.modify && this.resource.url === this.form.url) {
        this.urlExist = false
        this.urlStared = false
        this.$refs.form.validate()
        return
      }
      const url = this.form.url.trim()
      if (url !== '') {
        checkUrlExsit({ url: url }).then((res) => {
          if (res.items.length === 1) {
            this.foundResource = res.items[0]
            this.urlExist = true
            isStarResource({ id: this.foundResource.id }).then((res) => {
              if (res.items.length === 1) {
                this.urlStared = true
              }
            })
          } else {
            this.urlExist = false
          }
          this.$refs.form.validate()
        })
      }
    }
  },
  computed: {
    title() {
      if (this.modify) {
        return '修改'
      }
      return '创建'
    },
    modify() {
      return this.$route.params.operation === 'modify'
    },
    create() {
      return this.$route.params.operation === 'create'
    },
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
      } else {
        return width * 0.9
      }
    }
  }
})
</script>

<style scoped>
.padding-horizontal {
  margin-left: 0;
  margin-right: 0;
}
.btn {
    text-transform: none;
}
</style>
