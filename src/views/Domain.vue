<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card
        v-if="domain"
        :width="width"
      >
        <v-card-text>
          <p class='display-1 text--primary'>{{ domain.title }}</p>
          <div class='text--primary'>{{ domain.intro }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn text x-small>
            <v-icon color='teal'> {{ starIcon }} </v-icon>
            标记
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
      >
        <v-menu v-model="showMenu">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
              {{ orderDesc }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(opt, index) in orderOptions"
              :key="index"
              @click="refresh(opt.order, opt.desc)"
            >
              <v-list-item-title>{{ opt.desc }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
import { getDomainCollections, getDomain } from '@/api/domains'

export default Vue.extend({
  name: 'Domain',
  data() {
    return {
      collections: [],
      domain: null,
      showMenu: false,
      orderOptions: [
        {
          order: 'time_desc',
          desc: '最新'
        },
        { order: 'time_asc', desc: '最早' }
      ],
      orderDesc: '最新',
      order: 'time_desc',
      starIcon: 'star_border'
    }
  },
  mounted() {
    this.loadCollections()
    this.loadDomain()
  },
  methods: {
    refresh(order, orderDesc) {
      this.order = order
      this.orderDesc = orderDesc
      this.loadCollections()
    },
    loadCollections() {
      getDomainCollections({
        id: this.$route.params.id,
        offset: 1,
        limit: 10,
        order: this.order
      }).then((res) => {
        this.collections.splice(0, this.collections.length)
        this.collections.push(...res.items)
      })
    },
    loadDomain() {
      getDomain({
        id: this.$route.params.id
      }).then((res) => {
        this.domain = res.items[0]
      })
    }
  },
  computed: {
    width() {
      let width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        width = height
      }
      return width * 0.9
    }
  }
})
</script>
