<template>
  <v-container>
    <v-skeleton-loader
      v-if="!collection"
      v-bind="attrs"
      type="card, actions"
    ></v-skeleton-loader>
    <v-card
      v-if="collection"
    >
      <v-card-text>
        <div class="caption"> 合集  位于  <router-link :to="'/explore/domain/' + collection.domain_id"> {{ collection.domain_title }} </router-link> </div>
        <div class='subtitle-1 font-weight-bold text--primary'>{{ collection.title }}</div>
        <div v-marked class='text--primary my-4'
        > {{ description }} </div>
        <div class="caption"> {{ readableTime(collection.modify_time) }} 修改 </div>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              text
              @click="onClickcollect"
            >
              <v-icon
                left
                :color='loginColor()'
              > {{ loginIcon() }} </v-icon>
              {{ loginIndicator() }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              text
              v-if="isModifiable"
              :to="{ path: '/op/modify/collection', query: { id: collection.id }}"
            >
              <v-icon
                left
                color="primary"
              > mdi-pencil-outline </v-icon>
              修改集合
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              text
              v-if="isAdmin"
              @click="onClickDeleteCollections"
            >
              <v-icon
                left
                color="primary"
              > mdi-trash-can-outline </v-icon>
              删除集合
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-list-item>
      <v-list-item-content class="subtitle-2"> 资源列表 </v-list-item-content>
    </v-list-item>
    <v-card
      v-for='(resource, index) in resources'
      :key='index'
      class='mb-2'
      :to="{ path: '/explore/resource/' + resource.id.toString() }"
    >
      <v-card-text>
        <img v-if="isTypeCached()" :src="badgeUrl(resource)">
        <div class='subtile-1 text--primary'> {{ resource.title }} </div>
        <div class='caption text--primary'><a
            target='_blank'
            :href="resource.url"
          >{{ resource.url }}</a></div>
        <div class="caption"> {{ readableTime(resource.modify_time) }} 修改 </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  getCollectionResources,
  getCollection,
  isCollectCollection,
  collectCollection,
  uncollectCollection,
  deleteCollection
} from '@/api/collections'
import { UserModule } from '@/store/modules/user'
import { readableTimestamp } from '@/utils/time'
import { badgeUrl } from '@/utils/type'
import { GlobalModule } from '@/store/modules/global'

export default Vue.extend({
  name: 'Collection',
  data() {
    return {
      resources: [],
      description: '',
      collection: null,
      collected: false,
      collecting: false
    }
  },
  mounted() {
    this.loadResources()
    this.loadCollection()
    this.checkCollect()
  },
  methods: {
    isTypeCached() {
      return GlobalModule.resourceTypeCached
    },
    readableTime(val) {
      return readableTimestamp(val)
    },
    onClickcollect() {
      if (UserModule.isLoggedIn) {
        if (!this.collecting) {
          this.collecting = true
          if (this.collected) {
            uncollectCollection({ id: this.$route.params.id }).then((res) => {
              if (res.items.length === 1) {
                this.collected = false
              }
              this.collecting = false
            })
          } else {
            collectCollection({ id: this.$route.params.id }).then((res) => {
              if (res.items.length === 1) {
                this.collected = true
              }
              this.collecting = false
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
      if (UserModule.isLoggedIn && this.collected) {
        return 'teal'
      } else {
        return 'grey'
      }
    },
    loginIndicator() {
      if (UserModule.isLoggedIn && this.collected) {
        return '已收藏'
      } else {
        return '收藏'
      }
    },
    loginIcon() {
      if (UserModule.isLoggedIn && this.collected) {
        return 'mdi-star'
      } else {
        return 'mdi-star-outline'
      }
    },
    checkCollect() {
      if (UserModule.isLoggedIn) {
        isCollectCollection({ id: this.$route.params.id }).then((res) => {
          if (res.items.length === 1) {
            this.collected = true
          } else {
            this.collected = false
          }
        })
      }
    },
    loadResources() {
      getCollectionResources({
        id: this.$route.params.id
      }).then((res) => {
        this.resources.push(...res.items)
      })
    },
    loadCollection() {
      getCollection({
        id: this.$route.params.id
      }).then((res) => {
        this.collection = res.items[0]
        document.title = this.collection.title + ' - 阡陌'
        this.description = this.collection.description
      })
    },
    badgeUrl(resource) {
      return badgeUrl(resource.resource_type_id, resource.media_type_id)
    },
    onClickDeleteCollections() {
      this.$confirm('一旦删除不可恢复，继续删除？').then(res => {
        if (res) {
          deleteCollection({ id: this.$route.params.id }).then((res) => {
            if (res.items.length === 1) {
              this.$toasted.show('删除成功')
              if (window.history.length <= 1) {
                this.$router.replace('/')
              } else {
                this.$router.back()
              }
            }
          })
        }
      })
    }
  },
  computed: {
    isModifiable() {
      return (
        this.collection &&
        UserModule.isLoggedIn &&
        UserModule.UserId === this.collection.author_id
      )
    },
    isAdmin() {
      return this.collection && UserModule.isLoggedIn && UserModule.isAdmin
    }
  }
})
</script>

<style>
.v-application code {
    background-color: #f8f8f8;
}
</style>
