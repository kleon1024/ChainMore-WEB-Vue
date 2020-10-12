<template>
  <v-container fluid>
    <v-card dense>
      <v-dialog
        scrollable
        max-width="10vw"
        v-model="showMoveToDialog"
      >
        <v-card>
          <v-card-title class="h6">移动认证到</v-card-title>
          <v-card-text max-height="10vh">
            <v-radio-group
              v-model="moveToDialogModel"
              column
            >
              <v-radio
                class="subtitle-2 text--primary"
                v-for="(group, index) in groups"
                :key="index"
                :label="group.title"
                :value="index"
                color="black"
              >
                <template v-slot:label>
                  <span class="subtitle-2 text--primary">
                    {{ group.title }}
                  </span>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey lighten-1"
              text
              @click="onClickMoveToDialog(false)"
            >取消</v-btn>
            <v-btn
              color="primary"
              text
              @click="onClickMoveToDialog(true)"
            >确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-form
        ref="form"
        v-model="valid"
        @submit.native.prevent
      >
        <v-row>
          <v-subheader class="mx-3">认证管理</v-subheader>
        </v-row>
        <v-list>
          <v-list-group
            v-for="(group, index) in groups"
            :key="'group' + index"
            :value="false"
          >
            <template v-slot:activator>
              <v-list-item-title
                v-if="!(modifyGrouping && modifyGroupIndex == index) "
                class="subtitle-2"
              >
                <span> {{ group.title }} </span>
                <TooltipIconButton
                  icon="mdi-pen"
                  tip="修改"
                  @click="onClickModifyGroup(index)"
                />
              </v-list-item-title>
              <v-list-item-title
                v-if="modifyGrouping && modifyGroupIndex == index"
                class="subtitle-2"
              >
                <v-text-field
                  autofocus
                  v-model="form.groupTitle"
                  :counter="groupTitleCount"
                  :rules="rules.groupTitle"
                  required
                  @blur="checkModifyGroup(index)"
                ></v-text-field>
              </v-list-item-title>
              <v-list-item-action-text
                v-if="!(modifyGrouping && modifyGroupIndex == index)"
                class="caption"
              >
                <v-btn
                  text
                  small
                  class="caption"
                >
                  {{ group.problems.length }} 条目
                </v-btn>
              </v-list-item-action-text>
              <v-list-item-action v-if="!(modifyGrouping && modifyGroupIndex == index)">
                <TooltipIconButton
                  icon="mdi-trash-can-outline"
                  tip="删除"
                  @click="onDeleteGroup(index)"
                />
              </v-list-item-action>
            </template>
            <v-list-item>
              <v-list-item-title
                v-if="!(modifyIntro && modifyGroupIndex == index)"
                class="subtitle-2"
              > 简介： {{ group.intro }} </v-list-item-title>
              <v-list-item-title
                v-if="modifyIntro && modifyGroupIndex == index"
                class="subtitle-2"
              >
                <v-text-field
                  autofocus
                  v-model="form.groupIntro"
                  :counter="groupIntroCount"
                  :rules="rules.groupIntro"
                  required
                  @blur="checkModifyGroupIntro(index)"
                ></v-text-field>
              </v-list-item-title>
              <v-list-item-action v-if="!(modifyIntro  && modifyGroupIndex == index)">
                <TooltipIconButton
                  icon="mdi-pen"
                  tip="修改"
                  @click="onClickModifyIntro(index)"
                />
              </v-list-item-action>
              <v-list-item-action v-if="!(modifyIntro  && modifyGroupIndex == index)">
                <v-menu
                  offset-y
                  outline
                  content-class="elevation-1"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on"
                      @click="click"
                    >
                      <v-icon>
                        mdi-playlist-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      dense
                      v-for="(action, li) in actions"
                      :key="li"
                      @click="action.function(index)"
                    >
                      <v-list-item-icon>
                        <v-icon v-text="action.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ action.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
            <v-list-group
              v-for="(p, i) in group.problems"
              :key="'problem' + i"
              :value="false"
              sub-group
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon> {{ problemTypeToIcon(p.type) }} </v-icon>
                </v-list-item-icon>
                <v-list-item-icon>
                </v-list-item-icon>
                <v-list-item-title class="subtitle-2">{{ p.digest }}
                </v-list-item-title>
                <v-list-item-action>
                  <TooltipIconButton
                    icon="mdi-file-move-outline"
                    tip="移动至"
                    @click="onClickMoveToButton(index, i)"
                  />
                </v-list-item-action>
                <v-list-item-action>
                  <TooltipIconButton
                    icon="mdi-trash-can-outline"
                    tip="删除"
                    @click="onClickDeleteCertification(index, i)"
                  />
                </v-list-item-action>
              </template>
              <div v-if="p.type === 'multiple_choice_problem'">
                <v-list-item v-if="!(modifyMCPing &&
                    modifyGroupIndex == index &&
                    modifyProblemIndex == i)">
                  <v-list-item-action-text class="subtitle-2">
                    {{ p.mcp.text }}
                  </v-list-item-action-text>
                  <v-list-item-action>
                    <TooltipIconButton
                      icon="mdi-pen"
                      tip="修改"
                      @click="onClickModifyMCPText(index, i)"
                    />
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="modifyMCPing &&
                    modifyGroupIndex == index &&
                    modifyProblemIndex == i">
                  <v-list-item-title class="subtitle-2">
                    <v-textarea
                      autofocus
                      v-model="form.mcpText"
                      :counter="mcpCount"
                      :rules="rules.mcpText"
                      auto-grow
                      rows="1"
                      required
                      placeholder="题干"
                      @blur="checkModifyMCP(index, i)"
                    ></v-textarea>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-menu content-class="elevation-1">
                      <template v-slot:activator="{ on }">
                        <v-btn
                          text
                          outlined
                          small
                          color="primary"
                          class="subtitle-2"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ mcpTypeText(p.mcp.type) }}
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          dense
                          v-for="(action, li) in mcpTypes"
                          :key="li"
                          @click="setMCPType(index, i, action.value)"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ action.name }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-title>
                  <v-list-item-action>
                    <TooltipIconButton
                      icon="mdi-plus-circle-outline"
                      tip="添加选项"
                      @click="onClickAddMCPChoice(index, i)"
                    />
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="addMCPChoice && modifyGroupIndex == index &&
                    modifyProblemIndex == i">
                  <v-list-item-title class="subtitle-2">
                    <v-textarea
                      autofocus
                      v-model="form.mcpChoiceText"
                      :counter="mcpChoiceCount"
                      :rules="rules.mcpChoiceText"
                      required
                      auto-grow
                      rows="1"
                      placeholder="选项"
                      @blur="checkAddMCPChoice(index, i)"
                    ></v-textarea>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-for="(choice, ci) in p.mcp.choices"
                  :key="'mcp' + ci"
                >
                  <v-list-item-icon v-if="!ifModifyMCPChoice(index, i, ci)">
                    <TooltipIconButton
                      :icon="p.mcp.answers.includes(choice.id) ? 'mdi-check' : 'mdi-close'"
                      :tip="p.mcp.answers.includes(choice.id) ? '正确选项' : '错误选项'"
                      @click="onClickSetMCPChoice(index, i, ci)"
                    />
                  </v-list-item-icon>
                  <v-list-item-title
                    v-if="!ifModifyMCPChoice(index, i, ci)"
                    class="subtitle-2"
                  > {{ choice.text }} </v-list-item-title>
                  <v-list-item-action v-if="!ifModifyMCPChoice(index, i, ci)">
                    <TooltipIconButton
                      icon="mdi-trash-can-outline"
                      tip="删除"
                      @click="onDeleteMCPChoice(index, i, ci)"
                    />
                  </v-list-item-action>
                  <v-list-item-action v-if="!ifModifyMCPChoice(index, i, ci)">
                    <TooltipIconButton
                      icon="mdi-pen"
                      tip="修改"
                      @click="onClickModifyChoice(index, i, ci)"
                    />
                  </v-list-item-action>
                  <v-list-item-title
                    v-if="ifModifyMCPChoice(index, i, ci)"
                    class="subtitle-2"
                  >
                    <v-textarea
                      autofocus
                      v-model="form.mcpChoiceText"
                      :counter="mcpChoiceCount"
                      :rules="rules.mcpChoiceText"
                      required
                      auto-grow
                      rows="1"
                      placeholder="选项"
                      @blur="checkModifyChoice(index, i, ci)"
                    ></v-textarea>
                  </v-list-item-title>
                </v-list-item>
              </div>
            </v-list-group>
            <v-list-item v-if="addMCPing && modifyGroupIndex == index">
              <v-list-item-title class="subtitle-2">
                <v-textarea
                  autofocus
                  v-model="form.mcpText"
                  :counter="mcpCount"
                  :rules="rules.mcpText"
                  required
                  auto-grow
                  rows="1"
                  placeholder="题干"
                  @blur="checkAddMCP(index)"
                ></v-textarea>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item v-if="!addGrouping">
            <v-row
              align="center"
              justify="center"
            >
              <v-list-item-action class="subtitle-2">
                <v-btn
                  text
                  outlined
                  @click="onClickAddGroup"
                >
                  添加认证组
                </v-btn>
              </v-list-item-action>
            </v-row>
          </v-list-item>
          <v-list-item v-if="addGrouping">
            <v-list-item-title>
              <v-text-field
                autofocus
                v-model="form.groupTitle"
                :counter="groupTitleCount"
                :rules="rules.groupTitle"
                placeholder="标题"
                required
                @blur="checkAddGroup"
              ></v-text-field>
            </v-list-item-title>
            <v-list-item-action>
              <v-btn
                text
                depressed
                color="primary"
                @click="clearAllStatus"
              >
                取消
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  getDomain,
  checkCertify,
  getManageCertifications,
  getCertificationGroups,
  putCertificationGroup,
  postCertificationGroup,
  deleteCertificationGroup,
  postMCP,
  putMCP,
  deleteMCP,
  postMCPChoice,
  putMCPChoice,
  deleteMCPChoice,
  postCertification,
  putCertification,
  deleteCertification
} from '@/api/domains'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ManageDomain',
  components: {
    TooltipIconButton
  },
  data() {
    return {
      valid: true,
      showMoveToDialog: false,
      moveToDialogModel: null,
      moveToGroupIndex: 0,
      moveToProblemIndex: 0,
      mcpTypes: [
        {
          name: '单向选择题:只有一项',
          value: 'single_answer'
        },
        {
          name: '多项选择题:至少一项',
          value: 'multiple_answer'
        },
        {
          name: '任意项选择题:可能零项',
          value: 'any_answer'
        }
      ],
      actions: [
        {
          icon: 'mdi-checkbox-multiple-marked-outline',
          name: '选择题',
          function: this.onClickAddMCP
        }
      ],
      groupTitleCount: 24,
      groupIntroCount: 512,
      mcpCount: 8192,
      mcpChoiceCount: 256,
      form: {
        groupTitle: '',
        groupIntro: '',
        mcpText: '',
        mcpChoiceText: ''
      },
      rules: {
        groupTitle: [
          (v) => !!v.trim() || '名称不能为空',
          (v) =>
            (v && v.length <= this.groupTitleCount) ||
            `标题必须小于${this.groupTitleCount}个字符`
        ],
        groupIntro: [
          (v) =>
            (v && v.length <= this.groupIntroCount) ||
            `简介必须小于${this.groupIntroCount}个字符`
        ],
        mcpText: [
          (v) => !!v.trim() || '选择题题干不能为空',
          (v) =>
            (v && v.length <= this.mcpCount) ||
            `选择题题干必须小于${this.mcpCount}个字符`
        ],
        mcpChoiceText: [
          (v) => !!v.trim() || '选择题选项不能为空',
          (v) =>
            (v && v.length <= this.mcpChoiceCount) ||
            `选择题选项必须小于${this.mcpChoiceCount}个字符`
        ]
      },
      addGrouping: false,
      modifyGrouping: false,
      modifyIntro: false,
      modifyMCPing: false,
      addMCPing: false,
      addMCPChoice: false,
      modifyMCPChoice: false,
      settingMCPChoice: false,
      modifyGroupIndex: 0,
      modifyProblemIndex: 0,
      modifyChoiceIndex: 0,
      showSnackbar: false,
      snackbarText: '',
      domains: [],
      searchInput: '',
      groupValue: true,
      problemValue: true,
      groups: []
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    problemTypeToIcon(type) {
      if (type === 'multiple_choice_problem') {
        return 'mdi-check-box-multiple-outline'
      }
    },
    loadDomain() {
      getDomain({
        id: this.$route.params.id
      }).then((res) => {
        this.domain = res.items[0]
      })
      if (this.isLoggedIn) {
        checkCertify({ id: this.$route.params.id }).then((res) => {
          if (res.items.length === 1) {
            this.certified = true
          }
        })
      }
    },
    loadCertificationGroups() {
      getCertificationGroups({ id: this.$route.params.id }).then((res) => {
        this.groups.splice(0, this.groups.length)
        for (let i = 0; i < res.items.length; i++) {
          const group = res.items[i]
          group.problems = []
          getManageCertifications({ id: group.id }).then((r) => {
            group.problems.push(...r.items)
          })
        }
        this.groups.push(...res.items)
      })
    },
    onClickAddGroup() {
      this.clearAllStatus()
      this.addGrouping = true
    },
    checkAddGroup() {
      this.clearAllStatus()
      if (this.$refs.form.validate()) {
        postCertificationGroup({
          domain: this.domain.id,
          title: this.form.groupTitle
        }).then((res) => {
          if (res.items.length === 1) {
            const group = res.items[0]
            group.problems = []
            this.groups.push(group)
          } else {
            this.$toasted.show('添加失败，请稍后重试', {
              theme: 'outline',
              position: 'top-center',
              duration: 500
            })
          }
        })
      }
    },
    onDeleteGroup(index) {
      this.$confirm('一旦删除将不可恢复，确认删除？', {
        buttonTrueText: '确认',
        buttonFalseText: '取消'
      }).then((res) => {
        if (res) {
          deleteCertificationGroup({ id: this.groups[index].id }).then(
            (res) => {
              if (res.items.length === 1) {
                this.groups.splice(index, 1)
              } else {
                this.$toasted.show('删除失败，请稍后重试', {
                  theme: 'outline',
                  position: 'top-center',
                  duration: 500
                })
              }
            }
          )
        }
      })
    },
    onClickDeleteCertification(groupIndex, problemIndex) {
      this.$confirm('一旦删除将不可恢复，确认删除？', {
        buttonTrueText: '确认',
        buttonFalseText: '取消'
      }).then((res) => {
        if (res) {
          deleteCertification({
            id: this.groups[groupIndex].problems[problemIndex].id
          }).then((res) => {
            if (res.items.length === 1) {
              this.groups[groupIndex].problems.splice(problemIndex, 1)
            } else {
              this.$toasted.show('删除失败，请稍后重试', {
                theme: 'outline',
                position: 'top-center',
                duration: 500
              })
            }
          })
        }
      })
    },
    onClickModifyGroup(index) {
      this.clearAllStatus()
      this.modifyGroupIndex = index
      this.modifyGrouping = true
      this.form.groupTitle = this.groups[index].title
    },
    checkModifyGroup(index) {
      if (this.$refs.form.validate()) {
        this.clearAllStatus()
        if (this.groups[index].title === this.form.groupTitle) return
        putCertificationGroup({
          id: this.groups[index].id,
          title: this.form.groupTitle
        }).then((res) => {
          if (res.items.length === 1) {
            this.groups[index].title = res.items[0].title
          } else {
            this.$toasted.show('更新失败，请稍后重试', {
              theme: 'outline',
              position: 'top-center',
              duration: 500
            })
          }
        })
      }
    },
    checkModifyGroupIntro(index) {
      if (this.$refs.form.validate()) {
        this.clearAllStatus()
        if (this.groups[index].intro === this.form.groupIntro) return
        putCertificationGroup({
          id: this.groups[index].id,
          intro: this.form.groupIntro
        }).then((res) => {
          if (res.items.length === 1) {
            this.groups[index].intro = res.items[0].intro
          } else {
            this.$toasted.show('更新失败，请稍后重试', {
              theme: 'outline',
              position: 'top-center',
              duration: 500
            })
          }
        })
      }
    },
    onClickModifyIntro(index) {
      this.clearAllStatus()
      this.modifyGroupIndex = index
      this.modifyIntro = true
      this.form.groupIntro = this.groups[index].intro
    },
    clearAllStatus() {
      this.addGrouping = false
      this.modifyGrouping = false
      this.modifyIntro = false
      this.addMCPing = false
      this.modifyMCPing = false
      this.addMCPChoice = false
      this.modifyMCPChoice = false
    },
    onClickAddMCP(index) {
      this.clearAllStatus()
      this.modifyGroupIndex = index
      this.addMCPing = true
    },
    checkAddMCP() {
      if (this.$refs.form.validate()) {
        postMCP({ text: this.form.mcpText }).then((res) => {
          if (res.items.length === 1) {
            const mcp = res.items[0]
            mcp.answers = []
            postCertification({
              group: this.groups[this.modifyGroupIndex].id,
              type: 'multiple_choice_problem',
              mcp: mcp.id
            }).then((res) => {
              if (res.items.length === 1) {
                const c = res.items[0]
                c.mcp = mcp
                this.groups[this.modifyGroupIndex].problems.push(c)
                this.form.mcpText = ''
              }
            })
          }
        })
        this.clearAllStatus()
      }
    },
    onClickModifyMCPText(groupIndex, problemIndex) {
      this.clearAllStatus()
      this.modifyGroupIndex = groupIndex
      this.modifyProblemIndex = problemIndex
      this.modifyMCPing = true
      this.form.mcpText = this.groups[groupIndex].problems[
        problemIndex
      ].mcp.text
    },
    checkModifyMCP(groupIndex, problemIndex) {
      if (this.$refs.form.validate()) {
        if (
          this.groups[groupIndex].problems[problemIndex].mcp.text ===
          this.form.mcpText
        ) {
          return
        }
        putMCP({
          id: this.groups[groupIndex].problems[problemIndex].mcp.id,
          text: this.form.mcpText
        }).then((res) => {
          if (res.items.length === 1) {
            this.groups[groupIndex].problems[problemIndex].mcp.text =
              res.items[0].text
            this.groups[groupIndex].problems[
              problemIndex
            ].digest = res.items[0].text.slice(0, 64)
            this.form.mcpText = ''
          } else {
            this.$toasted.show('更新失败，请稍后重试', {
              theme: 'outline',
              position: 'top-center',
              duration: 500
            })
          }
        })
        this.clearAllStatus()
      }
    },
    onClickAddMCPChoice(groupIndex, problemIndex) {
      this.clearAllStatus()
      this.modifyGroupIndex = groupIndex
      this.modifyProblemIndex = problemIndex
      this.addMCPChoice = true
    },
    checkAddMCPChoice(groupIndex, problemIndex) {
      if (this.$refs.form.validate()) {
        postMCPChoice({
          mcp: this.groups[groupIndex].problems[problemIndex].mcp.id,
          text: this.form.mcpChoiceText
        }).then((res) => {
          if (res.items.length === 1) {
            this.groups[groupIndex].problems[problemIndex].mcp.choices.unshift(
              res.items[0]
            )
            this.form.mcpChoiceText = ''
          }
        })
        this.clearAllStatus()
      }
    },
    onClickSetMCPChoice(groupIndex, problemIndex, choiceIndex) {
      if (!this.settingMCPChoice) {
        this.settingMCPChoice = true
        const mcp = this.groups[groupIndex].problems[problemIndex].mcp
        const answer = !mcp.answers.includes(mcp.choices[choiceIndex].id)
        putMCPChoice({
          id: this.groups[groupIndex].problems[problemIndex].mcp.choices[
            choiceIndex
          ].id,
          answer: answer
        }).then((res) => {
          if (res.items.length === 1) {
            if (answer) {
              mcp.answers.push(res.items[0].id)
            } else {
              const i = mcp.answers.indexOf(res.items[0].id)
              if (i >= 0) {
                mcp.answers.splice(i, 1)
              }
            }
          }
          this.settingMCPChoice = false
        })
      }
    },
    mcpTypeText(t) {
      if (t === 'single_answer') {
        return '单向选择题'
      } else if (t === 'multiple_answer') {
        return '多项选择题'
      } else if (t === 'any_answer') {
        return '任意项选择'
      }
    },
    setMCPType(groupIndex, problemIndex, mcpType) {
      const mcp = this.groups[groupIndex].problems[problemIndex].mcp
      if (mcp.type === mcpType) return
      putMCP({ id: mcp.id, type: mcpType }).then((res) => {
        if (res.items.length === 1) {
          mcp.type = res.items[0].type
        }
      })
    },
    onDeleteMCPChoice(groupIndex, problemIndex, choiceIndex) {
      this.$confirm('一旦删除将不可恢复，确认删除？', {
        buttonTrueText: '确认',
        buttonFalseText: '取消'
      }).then((res) => {
        const mcp = this.groups[groupIndex].problems[problemIndex].mcp
        if (res) {
          deleteMCPChoice({
            id: mcp.choices[choiceIndex].id
          }).then((res) => {
            if (res.items.length === 1) {
              mcp.choices.splice(choiceIndex, 1)
              const i = mcp.answers.indexOf(res.items[0].id)
              if (i >= 0) {
                mcp.answers.splice()
              }
            } else {
              this.$toasted.show('删除失败，请稍后重试', {
                theme: 'outline',
                position: 'top-center',
                duration: 500
              })
            }
          })
        }
      })
    },
    onClickModifyChoice(groupIndex, problemIndex, choiceIndex) {
      this.clearAllStatus()
      this.modifyMCPChoice = true
      this.modifyGroupIndex = groupIndex
      this.modifyProblemIndex = problemIndex
      this.modifyChoiceIndex = choiceIndex
      this.form.mcpChoiceText = this.groups[groupIndex].problems[
        problemIndex
      ].mcp.choices[choiceIndex].text
    },
    checkModifyChoice(groupIndex, problemIndex, choiceIndex) {
      if (this.$refs.form.validate()) {
        const choice = this.groups[groupIndex].problems[problemIndex].mcp
          .choices[choiceIndex]
        if (this.form.mcpChoiceText.trim() === choice.text) return
        putMCPChoice({
          id: choice.id,
          text: this.form.mcpChoiceText.trim()
        }).then((res) => {
          if (res.items.length === 1) {
            choice.text = res.items[0].text
            this.form.mcpChoiceText = ''
          } else {
            this.$toasted.show('更新失败，请稍后重试', {
              theme: 'outline',
              position: 'top-center',
              duration: 500
            })
          }
        })
        this.clearAllStatus()
      }
    },
    ifModifyMCPChoice(groupIndex, problemIndex, choiceIndex) {
      return (
        this.modifyMCPChoice &&
        this.modifyGroupIndex === groupIndex &&
        this.modifyProblemIndex === problemIndex &&
        this.modifyChoiceIndex === choiceIndex
      )
    },
    onClickMoveToButton(groupIndex, problemIndex) {
      this.moveToGroupIndex = groupIndex
      this.moveToProblemIndex = problemIndex
      this.showMoveToDialog = true
    },
    onClickMoveToDialog(res) {
      if (res && this.moveToDialogModel !== this.moveToGroupIndex) {
        putCertification({
          id: this.groups[this.moveToGroupIndex].problems[
            this.moveToProblemIndex
          ].id,
          group: this.groups[this.moveToDialogModel].id
        }).then((res) => {
          if (res.items.length === 1) {
            const ps = this.groups[this.moveToGroupIndex].problems.splice(
              this.moveToProblemIndex,
              1
            )
            this.groups[this.moveToDialogModel].problems.push(...ps)
          }
        })
      }
      this.showMoveToDialog = false
    }
  },
  mounted() {
    this.loadDomain()
    this.loadCertificationGroups()
  }
})
</script>
