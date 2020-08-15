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
          <p> 合集 </p>
          <p class='display-1 text--primary'>{{ collection.title }}</p>
          <div class='text--primary'>{{ collection.description }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="onClickcollect"
          >
            <v-icon left :color='loginColor()'> {{ loginIcon() }} </v-icon>
            {{ loginIndicator() }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        :width='width'
        style='margin-top:20px'
        elevation="0"
        dense
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
          style='margin-top:20px'
          :to="{ path: '/resource/' + resource.id.toString() }"
        >
          <v-card-text>
            <p class='title text--primary'>{{ resource.title }}</p>
            <div class='text--primary'><a
                target='_blank'
                :href="resource.url"
              >{{ resource.url }}</a></div>
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
    this.checkCollct()
  },
  methods: {
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
        this.$route.push({
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
    checkCollct() {
      isCollectCollection({ id: this.$route.params.id }).then((res) => {
        if (res.items.length === 1) {
          this.collected = true
        } else {
          this.collected = false
        }
      })
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
