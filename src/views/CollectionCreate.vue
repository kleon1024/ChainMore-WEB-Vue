<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card :width="width">
        <v-card-text>
          <p class='display-1 text--primary'> {{ title }}合集 </p>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="form.title"
              :counter="32"
              :rules="rules.title"
              label="标题"
              outlined
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="form.description"
              :counter="1024"
              :rules="rules.description"
              label="描述或评论"
              outlined
              dense
              required
            ></v-text-field>
            <v-autocomplete
              v-model="form.domain"
              :items="markedDomains"
              :rules="rules.domain"
              item-text="title"
              item-value="id"
              dense
              outlined
              chips
              small-chips
              label="从收藏的领域添加"
            > </v-autocomplete>
            <v-autocomplete
              v-model="form.resources"
              :items="staredResources"
              :rules="rules.resources"
              item-text="title"
              item-value="id"
              dense
              outlined
              small-chips
              chips
              multiple
              label="从收藏的资源添加"
            >
              <template v-slot:selection="data">
                <v-card
                  :width="width"
                  :elevation="0"
                  dense
                  color="transparent"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  @click="data.select"
                  @click:close="remove(data.item)"
                >
                  <div
                    class="text--primary subtitle-2 display: inline-block text-truncate"
                    style="padding: 0.5em"
                  > {{ data.item.title }} </div>
                </v-card>
              </template>

            </v-autocomplete>
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
import { getStaredResources } from '@/api/resources'
import {
  createCollection,
  collectCollection,
  getCollection,
  getCollectionResources,
  modifyCollection
} from '@/api/collections'
import { getMarkedDomains } from '@/api/domains'

export default Vue.extend({
  name: 'ResourceCreate',
  data() {
    return {
      valid: true,
      form: {
        title: '',
        description: '',
        resources: [],
        domain: 0
      },
      rules: {
        title: [
          (v) => !!v.trim() || '标题不能为空',
          (v) => (v && v.length <= 32) || '标题必须小于32个字符'
        ],
        description: [
          (v) => v.length <= 1024 || '描述或评论必须小于1024个字符'
        ],
        domain: [(v) => this.checkDomain() || '请选择一个聚合领域']
      },
      staredResources: [],
      markedDomains: [],
      collection: null
    }
  },
  mounted() {
    this.loadStaredResources()
    this.loadMarkedDomains()
    this.loadCollection()
    this.checkDomainID()
  },
  methods: {
    checkDomainID() {
      if (this.create) {
        if (this.$route.query.domain) {
          this.form.domain = this.$route.query.domain
        }
      }
    },
    checkDomain() {
      for (let i = 0; i < this.markedDomains.length; i++) {
        if (this.markedDomains[i].id === this.form.domain) {
          return true
        }
      }
      return false
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.modify) {
          modifyCollection({
            id: this.collection.id,
            title: this.form.title,
            description: this.form.description,
            resources: this.form.resources,
            domain_id: this.form.domain
          }).then((res) => {
            if (res.items.length === 1) {
              const collection = res.items[0]
              collectCollection({
                id: collection.id
              }).then((res) => {
                this.$router.replace(this.$route.query.nextUrl)
              })
            }
          })
        } else {
          createCollection({
            title: this.form.title,
            description: this.form.description,
            resources: this.form.resources,
            domain_id: this.form.domain
          }).then((res) => {
            if (res.items.length === 1) {
              const collection = res.items[0]
              collectCollection({
                id: collection.id
              }).then((res) => {
                this.$router.replace(this.$route.query.nextUrl)
              })
            }
          })
        }
      }
    },
    loadStaredResources() {
      getStaredResources({ limit: 999 }).then((res) => {
        this.staredResources.splice(0, this.staredResources.length)
        this.staredResources.push(...res.items)
      })
    },
    loadMarkedDomains() {
      getMarkedDomains({ limit: 999 }).then((res) => {
        this.markedDomains.splice(0, this.markedDomains.length)
        this.markedDomains.push(...res.items)
      })
    },
    loadCollection() {
      if (this.modify) {
        getCollection({ id: this.$route.query.id }).then((res) => {
          if (res.items.length === 1) {
            this.collection = res.items[0]
            this.form.title = this.collection.title
            this.form.description = this.collection.description
            this.form.domain = this.collection.domain_id
          }
        })
        getCollectionResources({ id: this.$route.query.id }).then((res) => {
          for (let i = 0; i < res.items.length; i++) {
            this.form.resources.push(res.items[i].id)
          }
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
</style>
