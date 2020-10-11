<template>
  <v-app id="certify-group">
    <v-main app>
      <v-app-bar
        flat
        color="white"
      >
        <a href="/">
          <v-toolbar-title class="title font-weight-bold">阡陌</v-toolbar-title>
        </a>
        <v-spacer> </v-spacer>
      </v-app-bar>
      <v-container>
        <v-form
          ref="form"
          v-model="valid"
          @submit.native.prevent
        >
          <v-card
            min-height="80vh"
            v-if="certifications.length > 0 && certifications[curPage - 1].type == 'multiple_choice_problem'"
          >
            <v-subheader> 测试 </v-subheader>
            <v-card-text class="py-0">
              <div class="subtitle-1 text--primary">
                {{ certifications[curPage - 1].mcp.text }}
              </div>
            </v-card-text>
            <v-card-text
              class="py-0"
              v-if="certifications[curPage - 1].mcp.type !== 'single_answer'"
            >
              <v-checkbox
                v-for="(c,i) in certifications[curPage - 1].mcp.choices"
                :key="i"
                dense
                hide-details
                v-model="forms[curPage - 1].models"
                :value="c.id"
              >
                <template v-slot:label>
                  <span class="subtitle-2 text--primary">
                    {{ String.fromCharCode(65 + i) + '. ' + c.text }}
                  </span>
                </template>
              </v-checkbox>
            </v-card-text>
          </v-card>
        </v-form>
        <v-container>
          <v-pagination
            v-model="curPage"
            :length="certifications.length"
          ></v-pagination>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
import {
  getCertificationGroup,
  getCertifications,
  certify,
  checkCertify
} from '@/api/domains'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'CertifyGroup',
  components: {},
  data() {
    return {
      model: null,
      valid: false,
      curPage: 1,
      group: null,
      groupLoaded: false,
      certifications: [],
      certificationsLoaded: false,
      forms: []
    }
  },
  mounted() {
    this.loadCertifications()
    this.loadGroup()
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    loadCertifications() {
      getCertifications({ id: this.$route.params.id }).then((res) => {
        this.certifications.push(...res.items)
        this.certificationsLoaded = true
        for (let i = 0; i < res.items.length; i++) {
          const c = res.items[i]
          if (c.type === 'multiple_choice_problem') {
            if (c.mcp.type === 'single_answer') {
              this.forms.push({
                model: 0,
                label: ''
              })
            } else {
              this.forms.push({
                models: [],
                labels: []
              })
            }
          }
        }
      })
    },
    loadGroup() {
      getCertificationGroup({ id: this.$route.params.id }).then((res) => {
        if (res.items.length === 1) {
          this.group = res.items[0]
        }
        this.groupLoaded = true
      })
    },
    onConfirm() {
      this.$router.back()
    }
  }
})
</script>
