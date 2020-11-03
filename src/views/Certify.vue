<template>
  <v-app id="certify">
    <v-main>
      <v-app-bar flat color="appbar">
        <a href="/">
          <v-toolbar-title class="title font-weight-bold">阡陌</v-toolbar-title>
        </a>
        <v-spacer> </v-spacer>
        <v-toolbar-title v-if="domain" class="title font-weight-bold">{{ domain.title }}</v-toolbar-title>
      </v-app-bar>
      <v-container>
        <v-row>
          <v-col cols="12" sm="3"/>
          <v-col cols="12" sm="6">
          <NoCertifyCard
            v-if="isCertifiable()"
            :domain="domain"
            :tips="tips()"
            @certify="onCertify"
          />
          <CertifiedCard
            v-if="certified"
            :domain="domain"
            @confirm="onConfirm"
          />
          </v-col>
          <v-col cols="12" sm="3"/>
        </v-row>
        <v-row v-if="!certified && !isCertifiable()">
          <v-sheet
            class="mx-auto"
            elevation="0"
            max-width="100%"
          >
            <v-slide-group  v-model="model" center-active show-arrows>
              <v-slide-item v-for="(group, index) in groups" :key="index" v-slot:default="{ active, toggle }" class="mx-1 my-2">
                <CertifyCard
                  :emphase="active"
                  :group="group"
                  :domain="domain"
                  :to="{path: '/certify/group/' + group.id}"
                  :toggle="toggle"
                />
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-row>
        <v-row v-if="!certified && !isCertifiable()" align="center" justify="center">
          <v-expand-transition>
            <v-sheet
              v-if="model != null"
            >
              <v-card-text>
                <p class="subtitle-1 text--primary"> {{ this.groups[model].intro }} </p>
              </v-card-text>
            </v-sheet>
          </v-expand-transition>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
import {
  getCertificationGroups,
  getDomain,
  getCertificationGroup,
  getCertification,
  certify,
  checkCertify
} from '@/api/domains'
import NoCertifyCard from '@/components/NoCertifyCard.vue'
import CertifiedCard from '@/components/CertifiedCard.vue'
import CertifyCard from '@/components/CertifyCard.vue'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'Certify',
  components: {
    NoCertifyCard,
    CertifiedCard,
    CertifyCard
  },
  data() {
    return {
      model: null,
      domain: null,
      domainLoaded: false,
      groups: [],
      groupsLoaded: false,
      certified: false
    }
  },
  mounted() {
    this.checkCertifyStatus()
    this.loadDomain()
    this.loadCertificationGroups()
  },
  methods: {
    isAllFinished() {
      if (!this.groupsLoaded) return false
      if (this.groups.length === 0) return false
      for (let i = 0; i < this.groups.length; i++) {
        if (!this.groups[i].finished) {
          return false
        }
      }
      return true
    },
    isCertifiable() {
      return !this.certified && this.groupsLoaded && (this.groups.length === 0 || this.isAllFinished())
    },
    tips() {
      if (!this.certified && this.groupsLoaded) {
        if (this.groups.length === 0) {
          return '暂无认证题目，可以直接认证'
        } else if (this.isAllFinished()) {
          return '已完成所有题目，可以认证'
        }
      }
      return ''
    },
    readableTime(val) {
      return readableTimestamp(val)
    },
    checkCertifyStatus() {
      checkCertify({ id: this.$route.query.domain }).then((res) => {
        if (res.items.length === 1) {
          this.certified = true
        }
      })
    },
    loadCertificationGroups() {
      getCertificationGroups({ id: this.$route.query.domain }).then((res) => {
        this.groups.push(...res.items)
        this.groupsLoaded = true
      })
    },
    loadDomain() {
      getDomain({ id: this.$route.query.domain }).then((res) => {
        if (res.items.length === 1) {
          this.domain = res.items[0]
        }
        this.domainLoaded = true
      })
    },
    onCertify() {
      certify({ id: this.$route.query.domain }).then((res) => {
        if (res.items.length === 1) {
          if (res.items[0].id === parseInt(this.$route.query.domain)) {
            this.certified = true
          }
        }
      })
    },
    onConfirm() {
      this.$router.back()
    }
  }
})
</script>
