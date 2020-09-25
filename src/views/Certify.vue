<template>
  <v-container>
    <AppBar />
    <v-row
      align='center'
      justify='center'
    >
      <NoCertifyCard
        v-if="isCertifiable()"
        :width="width"
        :domain="domain"
        :tips="tips()"
        @certify="onCertify"
      />
      <CertifiedCard
        v-if="certified"
        :width="width"
        :domain="domain"
        @confirm="onConfirm"
      />
      <v-sheet
        class="mx-auto"
        elevation="0"
        max-width="100%"
      >
        <v-slide-group v-if="!isCertifiable()" v-model="model" center-active>
          <v-slide-item v-for="(group, index) in groups" :key="index" v-slot:default="{ active, toggle }" style="margin: 0.5em">
            <CertifyCard
              :emphase="active"
              :width="width / 2"
              :group="group"
              :domain="domain"
              @confirm="onConfirm"
              :toggle="toggle"
            />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
      <v-expand-transition>
        <v-card
          v-if="model != null"
          tile
          :width="width / 2"
          elevation="0"
        >
          <v-card-text>
            <p class="text--primary"> {{ this.groups[model].intro }} </p>
          </v-card-text>
        </v-card>
      </v-expand-transition>
    </v-row>
  </v-container>
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
import AppBar from '@/components/AppBar.vue'
import NoCertifyCard from '@/components/NoCertifyCard.vue'
import CertifiedCard from '@/components/CertifiedCard.vue'
import CertifyCard from '@/components/CertifyCard.vue'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'Resource',
  components: {
    AppBar,
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
