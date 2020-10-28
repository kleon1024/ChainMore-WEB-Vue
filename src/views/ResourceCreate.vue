<template>
  <v-app id="resource-create">
  <v-main>
  <v-container>
      <v-card :width="width">
        <v-card-text>
          <p class='display-1 text--primary'> {{ title }}资源 </p>
          <v-card-actions v-if="urlExist">
            <router-link :to="'/explore/resource/' + foundResource.id" class="d-inline-block text-truncate">
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
              :items="resourceItems()"
              label="资源类型"
              item-text="name_zh_cn"
              item-value="id"
              outlined
              v-model="form.resourceTypeId"
            >
            </v-select>
            <v-select
              :items="mediaItems()"
              item-text="name_zh_cn"
              item-value="id"
              label="媒体类型"
              outlined
              v-model="form.mediaTypeId"
            >
            </v-select>
            <v-row class="mx-3">
              <p class="subheading font-weight-bold"> {{ combinedName() }} </p>
            </v-row>
            <v-row class="mx-3">
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
  </v-container>
  </v-main>
  </v-app>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import { getResourceType } from '@/api/main'
import { GlobalModule } from '@/store/modules/global'
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
          (v) => (v && v.length <= this.urlCount) || `Url必须小于${this.urlCount}个字符`,
          (v) => (v && v.startsWith('http')) || 'Url不合法',
          (v) => !this.urlExist || 'Url已存在'
        ],
        title: [
          (v) => !!v.trim() || '标题不能为空',
          (v) => (v && v.length <= this.titleCount) || `标题必须小于${this.titleCount}个字符`
        ]
      }
    }
  },
  mounted() {
    this.loadResource()
    GlobalModule.UpdateResourceType()
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
                if (window.history.length <= 1) {
                  window.close()
                } else {
                  this.$router.back()
                }
              })
            }
          })
        }
      }
    },
    mediaItems() {
      return GlobalModule.resourceMediaTypeMap[this.form.resourceTypeId] || []
    },
    resourceItems() {
      return GlobalModule.resourceItems
    },
    combinedName() {
      const m = GlobalModule.resourceMediaNameMap[`${this.form.resourceTypeId}${this.form.mediaTypeId}`]
      if (m === undefined) return ''
      return m.name_zh_cn
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
    }
  }
})
</script>

<style scoped>
.btn {
    text-transform: none;
}
</style>
