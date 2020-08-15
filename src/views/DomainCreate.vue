<template>
  <v-container>
    <v-row
      align='center'
      justify='center'
    >
      <v-card :width="width">
        <v-card-text>
          <p class='display-1 text--primary'> 创建领域 </p>
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
              item-text="title"
              item-value="id"
              dense
              outlined
              chips
              small-chips
              label="从收藏的领域添加聚合"
            > </v-autocomplete>
            <v-autocomplete
              v-model="form.depDomains"
              :items="markedDomains"
              item-text="title"
              item-value="id"
              dense
              outlined
              small-chips
              chips
              multiple
              label="从收藏的领域添加前置"
            > </v-autocomplete>
            <v-btn
              block
              outlined
              color="primary"
              @click="submit"
            >
              创建
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
  getMarkedDomains
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
        intro: [(v) => v.length <= 128 || '标题必须小于128个字符']
      },
      markedDomains: []
    }
  },
  mounted() {
    this.loadMarkedDomains()
  },
  methods: {
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
              this.$router.replace(this.$route.query.nextUrl)
            })
          }
        })
      }
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

<style scoped>
.padding-horizontal {
  margin-left: 0;
  margin-right: 0;
}
</style>
