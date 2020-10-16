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
        <v-btn text outlined color="primary" @click="onClickSubmit">
          提交答案
        </v-btn>
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
            <v-subheader>
              测试 {{ curPage }}
              <v-spacer></v-spacer>
              <v-btn text small color="grey lighten-1">
                {{ mcpTypeToText(certifications[curPage - 1].mcp.type) }}
              </v-btn>
            </v-subheader>
            <v-card-text class="py-0" v-for="(c, i) in certifications" :key="i">
              <div v-marked class="subtitle-2 text--primary" v-if="curPage - 1 === i">
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
                hide-details
                v-model="forms[curPage - 1].answers"
                :value="c.id"
                :rules=" certifications[curPage - 1].mcp.type === 'any_answer' ? rules.mcp.anyAnswer : rules.mcp.multipleAnswer"
                required
              >
                <template v-slot:label>
                  <span class="subtitle-2 text--primary">
                    {{ String.fromCharCode(65 + i) + '. ' + c.text }}
                  </span>
                </template>
              </v-checkbox>
            </v-card-text>
            <v-card-text class="py-0" v-if="certifications[curPage - 1].mcp.type === 'single_answer'">
              <v-radio-group v-model="forms[curPage - 1].answers" :rules="rules.mcp.singleAnswer" required>
                <v-radio
                  class="subtitle-2 text--primary py-1"
                  v-for="(c, i) in certifications[curPage - 1].mcp.choices"
                  :key="i"
                  :label="c.text"
                  :value="c.id"
                >
                  <template v-slot:label>
                    <span class="subtitle-2 text--primary">
                      {{ String.fromCharCode(65 + i) + '. ' +  c.text }}
                    </span>
                  </template>
                </v-radio>
              </v-radio-group>
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
  certificate
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
      forms: [],
      rules: {
        mcp: {
          anyAnswer: [],
          multipleAnswer: [
            (v) => v.length > 0 || '请至少选择一个选项'
          ],
          singleAnswer: [
            (v) => !!v || '请选择一个选项'
          ]
        }
      }
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
        const cs = res.items.sort(() => 0.5 - Math.random())
        for (let i = 0; i < cs.length; i++) {
          const c = cs[i]
          if (c.type === 'multiple_choice_problem') {
            c.mcp.choices = c.mcp.choices.sort(() => 0.5 - Math.random())
            this.certifications.push(c)
          }
        }
        this.certificationsLoaded = true
        for (let i = 0; i < cs.length; i++) {
          const c = cs[i]
          if (c.type === 'multiple_choice_problem') {
            if (c.mcp.type === 'single_answer') {
              this.forms.push({
                type: c.type,
                answers: 0
              })
            } else {
              this.forms.push({
                type: c.type,
                answers: []
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
    mcpTypeToText(t) {
      if (t === 'single_answer') {
        return '单项选择题:只有一项'
      } else if (t === 'multiple_answer') {
        return '多项选择题:至少一项'
      } else if (t === 'any_answer') {
        return '任意项选择题:可能零项'
      }
    },
    onConfirm() {
      this.$router.back()
    },
    onClickSubmit() {
      const unfinished = this.validateAllAnswer()
      const answers = {}
      if (unfinished === -1) {
        this.$confirm('检查无误，确认提交？').then((res) => {
          if (!res) return
          for (let i = 0; i < this.certifications.length; i++) {
            const c = this.certifications[i]
            if (c.type === 'multiple_choice_problem') {
              if (c.mcp.type === 'single_answer') {
                answers[c.id] = {
                  type: c.type,
                  answers: [this.forms[i].answers]
                }
              } else {
                answers[c.id] = {
                  type: c.type,
                  answers: this.forms[i].answers
                }
              }
            }
          }
          certificate({ id: this.group.id, answers: answers }).then((res) => {
            if (res.items.length === 1) {
              this.$toasted.show('认证成功，请再接再厉')
              this.$router.back()
            }
          }).catch(err => {
            if (err.response) {
              if (err.response.status === 500) {
                this.$toasted.show('认证失败，请重新来过')
                this.$router.back()
              }
            }
          })
        })
      } else {
        this.$toasted.show('还没有完成测试' + (unfinished + 1))
      }
    },
    validateAllAnswer() {
      for (let i = 0; i < this.certifications.length; i++) {
        const c = this.certifications[i]
        if (c.type === 'multiple_choice_problem') {
          if (c.mcp.type === 'single_answer') {
            if (!this.forms[i].answers) return i
          } else if (c.mcp.type === 'multiple_answer') {
            if (this.forms[i].answers.length === 0) return i
          }
        }
      }
      return -1
    }
  }
})
</script>

<style>
.v-application code {
    background-color: #f8f8f8;
}
</style>
