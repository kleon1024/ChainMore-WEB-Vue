<template>
  <v-container>
    <AppBar />
    <v-row
      align='center'
      justify='center'
    >
      <NoCertifyCard
        v-if="!certified && groupsLoaded && groups.length === 0"
        :width="width"
        :domain="domain"
        @certify="onCertify"
      />
      <CertifiedCard
        v-if="certified"
        :width="width"
        :domain="domain"
        @confirm="onConfirm"
      />
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
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'Resource',
  components: {
    AppBar,
    NoCertifyCard,
    CertifiedCard
  },
  data() {
    return {
      domain: null,
      domainLoaded: false,
      groups: [],
      groupsLoaded: false,
      group: null,
      certfications: [],
      certified: false
    }
  },
  mounted() {
    this.checkCertifyStatus()
    this.loadDomain()
    this.loadCertificationGroups()
  },
  methods: {
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
