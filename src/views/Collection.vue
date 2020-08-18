<template>
  <v-container>
    <AppBar />
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        v-if="collection"
        :width="width"
      >
        <v-card-text>
          <div> 合集  位于  {{ collection.domain_title }} </div>
          <div class='title font-weight-bold text--primary'>{{ collection.title }}</div>
          <div
            v-if="collection.description!==''"
            class='text--primary'
          >{{ collection.description }}</div>
          <div> {{ readableTime(collection.modify_time) }} 修改 </div>
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
                :to="{ path: '/op/modify/collection', query: { nextUrl: $route.path, id: collection.id }}"
              >
                <v-icon
                  left
                  color="teal"
                > mdi-pencil-outline </v-icon>
                修改集合
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        :width='width'
        style='margin-top:0px'
        color="transparent"
        elevation="0"
      >
        <v-card-text> 资源列表 </v-card-text>
      </v-card>
    </v-row>
    <v-row
      v-for='(resource, index) in resources'
      :key='index'
      align='center'
      justify='center'
    >
      <v-card
        :width='width'
        style='margin-bottom:10px'
        :to="{ path: '/resource/' + resource.id.toString() }"
      >
        <v-card-text>
          <div class='title text--primary'>{{ resource.title }}</div>
          <div class='text--primary'><a
              target='_blank'
              :href="resource.url"
            >{{ resource.url }}</a></div>
          <div> {{ readableTime(resource.modify_time) }} 修改 </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  getCollectionResources,
  getCollection,
  isCollectCollection,
  collectCollection,
  uncollectCollection
} from '@/api/collections'
import { UserModule } from '@/store/modules/user'
import AppBar from '@/components/AppBar.vue'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'Collection',
  components: {
    AppBar
  },
  data() {
    return {
      resources: [],
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
        return 'star'
      } else {
        return 'star_border'
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
