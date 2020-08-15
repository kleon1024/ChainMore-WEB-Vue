<template>
  <v-container>
    <AppBar />
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        v-if="resource"
        :width="width"
      >
        <v-card-text>
          <p> 资源 </p>
          <p class='display-1 text--primary'>{{ resource.title }}</p>
          <a
            :href="resource.url"
            target="_blank"
          >
            <div>{{ resource.url }}</div>
          </a>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="onClickMark"
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
        <v-card-text> 相关集合 </v-card-text>
      </v-card>
    </v-row>
    <v-row
      align='center'
      justify='center'
      v-for='(collection, index) in collections'
      :key='index'
    >
      <v-card
        :width='width'
        style='margin-top:20px'
        :to="{ path: '/collection/' + collection.id.toString() }"
      >
        <v-card-text>
          <div class='text--primary'> {{ collection.domain_title }}</div>
          <p> </p>
          <p class='headline text--primary'>{{ collection.title }}</p>
          <p> </p>
          <div class='text--primary'>{{ collection.description }}</div>
          <p> </p>
          <p class="text--primary"> {{ collection.modify_time }} </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            x-small
            color='teal'
            :to="{ path: '/collection/' + collection.id.toString() }"
          >LEARN MORE</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
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
import AppBar from '@/components/AppBar.vue'

export default Vue.extend({
  name: 'Resource',
  components: {
    AppBar
  },
  data() {
    return {
      collections: [],
      resource: null,
      stared: false,
      staring: false
    }
  },
  mounted() {
    this.loadResource()
    this.loadCollections()
  },
  methods: {
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
        this.$route.push({
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
        return 'star'
      } else {
        return 'star_border'
      }
    },
    checkStar() {
      isStarResource({ id: this.$route.params.id }).then((res) => {
        if (res.items.length === 1) {
          this.stared = true
        } else {
          this.stared = false
        }
      })
    },
    loadResource() {
      getResource({
        id: this.$route.params.id
      }).then((res) => {
        this.resource = res.items[0]
      })
    },
    loadCollections() {
      getRefCollections({
        id: this.$route.params.id
      }).then((res) => {
        this.collections.splice(0, this.collections.length)
        this.collections.push(...res.items)
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
