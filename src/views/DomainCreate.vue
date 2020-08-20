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
          <p class='display-1 text--primary'> {{ title }}领域 </p>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="form.title"
              :counter="16"
              :rules="rules.title"
              label="标题"
              outlined
              dense
              required
              @blur="checkDomain"
            ></v-text-field>
            <v-text-field
              v-model="form.intro"
              :counter="128"
              :rules="rules.intro"
              label="简介"
              outlined
              dense
              required
            ></v-text-field>
            <v-autocomplete
              v-model="form.aggDomain"
              :items="markedDomains"
              :rules="rules.aggDomain"
              item-text="title"
              item-value="id"
              dense
              outlined
              chips
              small-chips
              label="从已收藏的领域添加聚合"
            > </v-autocomplete>
            <v-autocomplete
              v-model="form.depDomains"
              :items="markedDomains"
              :rules="rules.depDomains"
              item-text="title"
              item-value="id"
              dense
              outlined
              small-chips
              chips
              multiple
              label="从已收藏的领域添加前置"
            > </v-autocomplete>
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
import {
  createDomain,
  markDomain,
  checkDomainExist,
  getMarkedDomains,
  getDomain,
  updateDomain,
  getDependedDomains,
  getAggregatorDomains
} from '@/api/domains'

export default Vue.extend({
  name: 'DomainCreate',
  data() {
    return {
      valid: true,
      form: {
        title: '',
        intro: '',
        aggDomain: 0,
        depDomains: []
      },
      aggDrawer: false,
      depDrawer: false,
      domainExist: false,
      rules: {
        title: [
          (v) => !!v.trim() || '标题不能为空',
          (v) => (v && v.length <= 16) || 'Url必须小于16个字符',
          (v) => !this.domainExist || '领域已存在'
        ],
        intro: [(v) => v.length <= 128 || '标题必须小于128个字符'],
        aggDomain: [
          (v) => this.checkAggDomain(this.form.aggDomain) || this.aggDomainTip
        ],
        depDomains: [
          (v) =>
            this.checkDepDomains(this.form.depDomains) || this.depDomainsTip
        ]
      },
      markedDomains: [],
      domain: null
    }
  },
  mounted() {
    this.loadMarkedDomains()
    this.loadDomain()
    this.checkDomainName()
  },
  methods: {
    checkAggDomain(domain) {
      if (domain === 0) {
        return false
      }
      for (let i = 0; i < this.markedDomains.length; i++) {
        if (this.markedDomains[i].id === domain) {
          return true
        }
      }
      return false
    },
    checkDepDomains(domains) {
      if (domains.length === 0) {
        return false
      }
      for (let j = 0; j < domains.length; j++) {
        const domain = domains[j]
        if (!this.checkAggDomain(domain)) {
          return false
        }
      }
      return true
    },
    checkDomainName() {
      if (this.create) {
        if (this.$route.query.domainName) {
          this.form.title = this.$route.query.domainName
        }
      }
    },
    loadDomain() {
      if (!this.modify) return

      getDomain({ id: this.$route.query.id }).then((res) => {
        if (res.items.length === 1) {
          this.domain = res.items[0]
          this.form.title = this.domain.title
          this.form.intro = this.domain.intro
        }
      })
      getDependedDomains({
        id: this.$route.query.id,
        distance: 1,
        lower: 1
      }).then((res) => {
        for (let i = 0; i < res.items.length; i++) {
          this.form.depDomains.push(res.items[i].id)
        }
      })
      getAggregatorDomains({
        id: this.$route.query.id,
        distance: 1,
        lower: 1
      }).then((res) => {
        this.form.aggDomain = res.items[0].id
      })
    },
    loadMarkedDomains() {
      getMarkedDomains({ limit: 999 }).then((res) => {
        let i = 0
        for (i = 0; i < res.items.length; i++) {
          if (res.items[i].id === 1) {
            break
          }
        }
        const rootDomains = res.items.splice(i, 1)
        this.markedDomains.splice(0, this.markedDomains.length)
        this.markedDomains.push(...rootDomains)
        this.markedDomains.push(...res.items)
      })
    },
    onAggClicked() {
      this.depDrawer = false
      this.aggDrawer = !this.aggDrawer
    },
    onDepClicked() {
      this.aggDrawer = false
      this.depDrawer = !this.depDrawer
    },
    checkDomain() {
      if (this.domain && this.modify && this.form.title === this.domain.title) {
        this.domainExist = false
        this.$refs.form.validate()
        return
      }
      checkDomainExist({ title: this.form.title }).then((res) => {
        if (res.items.length === 1) {
          this.domainExist = true
        } else {
          this.domainExist = false
        }
        this.$refs.form.validate()
      })
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.modify) {
          updateDomain({
            id: this.domain.id,
            title: this.form.title,
            intro: this.form.intro,
            aggregators: [this.form.aggDomain],
            dependeds: this.form.depDomains
          }).then((res) => {
            if (res.items.length === 1) {
              const domain = res.items[0]
              markDomain({
                id: domain.id
              }).then((res) => {
                this.$router.back()
              })
            }
          })
        } else {
          createDomain({
            title: this.form.title,
            intro: this.form.intro,
            aggregators: [this.form.aggDomain],
            dependeds: this.form.depDomains
          }).then((res) => {
            if (res.items.length === 1) {
              const domain = res.items[0]
              markDomain({
                id: domain.id
              }).then((res) => {
                this.$router.back()
              })
            }
          })
        }
      }
    }
  },
  computed: {
    aggDomainTip() {
      let title = '当前领域'
      if (this.form.title.trim() !== '') {
        title = this.form.title.trim()
      }
      return `请选择一个聚合领域，所有发布于${title}的合集将同步在聚合领域中显示`
    },
    depDomainsTip() {
      let title = '当前领域'
      if (this.form.title.trim() !== '') {
        title = this.form.title.trim()
      }
      return `请至少选择一个前置领域，需要获得所有直接前置领域的认证才能参与${title}`
    },
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
