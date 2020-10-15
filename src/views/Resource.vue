<template>
  <v-container>
    <v-card
      v-if="resource"
    >
      <v-card-text>
        <div class="caption"> 资源 </div>
        <img :src="badgeUrl(resource)">
        <div class='subtitle-1 text--primary'>{{ resource.title }}</div>
        <a
          :href="resource.url"
          target="_blank"
        >
          <div class="caption">{{ resource.url }}</div>
        </a>
        <div class="caption"> {{ readableTime(resource.modify_time) }} 修改 </div>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              text
              @click="onClickStar"
            >
              <v-icon
                left
                :color='loginColor()'
              > {{ loginIcon() }} </v-icon>
              {{ loginIndicator() }}
            </v-btn>
          </v-col>
          <v-col v-if="isModifiable">
            <v-btn
              text
              :to="{ path: '/op/modify/resource', query: { id: resource.id }}"
            >
              <v-icon
                left
                color="teal"
              > mdi-pencil-outline </v-icon>
              修改资源
            </v-btn>
          </v-col>
          <v-col v-if="stared">
            <v-btn
              text
              :to="{ path: '/op/create/collection', query: { resource: resource.id }}"
            >
              <v-icon
                left
                color="teal"
              > mdi-playlist-plus </v-icon>
              合集引用
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-card
      color="transparent"
      elevation="0"
    >
      <v-card-text> 相关集合 </v-card-text>
    </v-card>
    <v-card
      v-for='(collection, index) in collections'
      :key='`${index}-collection`'
      class='mb-2'
      :to="{ path: '/explore/collection/' + collection.id.toString() }"
    >
      <v-card-text>
        <div class='caption text--primary'> {{ collection.domain_title }}</div>
        <div class='subtitle-1 text--primary'>{{ collection.title }}</div>
        <div class='subtitle-2 text--primary'>{{ collection.description }}</div>
        <div class="caption text--primary"> {{ readableTime(collection.modify_time) }} 修改 </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  getResource,
  getRefCollections,
  isStarResource,
  starResource,
  unstarResource
} from '@/api/resources'
import { UserModule } from '@/store/modules/user'
import { readableTimestamp } from '@/utils/time'
import { badgeUrl } from '@/utils/type'

export default Vue.extend({
  name: 'Resource',
  data() {
    return {
      collections: [],
      resource: null,
      stared: false,
      staring: false
    }
  },
  mounted() {
    this.loadCollections()
    this.loadResource()
    this.checkStar()
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    onClickStar() {
      if (UserModule.isLoggedIn) {
        if (!this.staring) {
          this.staring = true
          if (this.stared) {
            unstarResource({ id: this.$route.params.id }).then((res) => {
              if (res.items.length === 1) {
                this.stared = false
              }
              this.staring = false
            })
          } else {
            starResource({ id: this.$route.params.id }).then((res) => {
              if (res.items.length === 1) {
                this.stared = true
              }
              this.staring = false
            })
          }
        }
      } else {
        this.$router.push({
          path: '/login',
          query: { nextUrl: this.$route.path }
        })
      }
    },
    loginColor() {
      if (UserModule.isLoggedIn && this.stared) {
        return 'teal'
      } else {
        return 'grey'
      }
    },
    loginIndicator() {
      if (UserModule.isLoggedIn && this.stared) {
        return '已收藏'
      } else {
        return '收藏'
      }
    },
    loginIcon() {
      if (UserModule.isLoggedIn && this.stared) {
        return 'mdi-star'
      } else {
        return 'mdi-star-outline'
      }
    },
    checkStar() {
      if (UserModule.isLoggedIn) {
        isStarResource({ id: this.$route.params.id }).then((res) => {
          if (res.items.length === 1) {
            this.stared = true
          } else {
            this.stared = false
          }
        })
      }
    },
    loadResource() {
      getResource({
        id: this.$route.params.id
      }).then((res) => {
        this.resource = res.items[0]
        document.title = this.resource.title + ' - 阡陌'
      })
    },
    loadCollections() {
      getRefCollections({
        id: this.$route.params.id
      }).then((res) => {
        this.collections.splice(0, this.collections.length)
        this.collections.push(...res.items)
      })
    },
    badgeUrl(resource) {
      return badgeUrl(resource.resource_type, resource.media_type)
    }
  },
  computed: {
    isModifiable() {
      return (
        this.resource &&
        UserModule.isLoggedIn &&
        UserModule.UserId === this.resource.author_id
      )
    }
  }
})
</script>
