<template>
  <v-container fluid>
    <v-card dense>
      <v-row>
        <v-subheader class="mx-3">认证管理</v-subheader>
      </v-row>
      <v-list>
        <v-list-group v-for="(group, index) in groups" :key="'group' + index" :value="true">
          <template v-slot:activator>
            <v-list-item-title class="subtitle-2">{{ group.title }}</v-list-item-title>
            <v-list-item-text class="caption">
              <v-btn text flat small class="caption">
                {{ group.problems.length }} 条目
              </v-btn>
            </v-list-item-text>
          </template>
          <v-list-group v-for="(p, i) in group.problems" :key="'problem' + i" :value="true" sub-group>
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon> {{ problemTypeToIcon(p.type) }} </v-icon>
              </v-list-item-icon>
              <v-list-item-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ p.digest }}</v-list-item-title>
              <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      flat
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon> mdi-file-move-outline </v-icon>
                    </v-btn>
                  </template>
                  <span>移动至</span>
                </v-tooltip>
              </v-list-item-action>
              <!-- <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      flat
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon> mdi-cancel </v-icon>
                    </v-btn>
                  </template>
                  <span>禁止生效</span>
                </v-tooltip>
              </v-list-item-action> -->
              <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      flat
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon> mdi-pen </v-icon>
                    </v-btn>
                  </template>
                  <span>修改</span>
                </v-tooltip>
              </v-list-item-action>
            </template>
            <div v-if="p.type === 'multiple_choice_problem'">
            <v-list-item>
              <v-list-item-text class="subtitle-2">
                {{ p.mcp.text }}
              </v-list-item-text>
              <v-list-item-action>
               <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      flat
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-pen
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>修改</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item
              v-for="(choice, index) in p.mcp.choices" :key="'mcp' + index">
              <v-list-item-icon>
                <v-icon small color="primary">
                  {{ p.mcp.answers.includes(choice.id) ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title class="subtitle-2"> {{ choice.text }} </v-list-item-title>
              <v-list-item-action>
               <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      flat
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>删除</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-action>
               <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      flat
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-pen
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>修改</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
              </v-list-item-title>
              <v-list-item-action>
               <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      flat
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-plus-circle-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>添加选项</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
            </div>
          </v-list-group>
          <v-list-item>
            <v-list-item-title> </v-list-item-title>
              <v-list-item-action>
               <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      flat
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-playlist-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>添加测试</span>
                </v-tooltip>
              </v-list-item-action>
          </v-list-item>
        </v-list-group>
        <v-list-item v-if="!addGrouping">
          <v-row align="center" justify="center">
            <v-list-item-action class="subtitle-2">
              <v-btn
                text
                flat
                outlined
                @click="addCertificationGroup"
              >
                添加认证组
              </v-btn>
            </v-list-item-action>
          </v-row>
        </v-list-item>
        <v-list-item v-if="addGrouping">
          <v-list-item-title>
            <v-text-field @></v-text-field>
          </v-list-item-title>
          <v-list-item-action>
            <v-btn
              depressed
              color="primary"
            >
              取消
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { getDomain, checkCertify, getManageCertifications, getCertificationGroups } from '@/api/domains'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ResourcePanel',
  components: {},
  data: () => ({
    domains: [],
    searchInput: '',
    groupValue: true,
    problemValue: true,
    addGrouping: false,
    groups: [
      {
        title: '基础测试',
        problems: [
          {
            type: 'multiple_choice_problem',
            digest: 'text',
            mcp: {
              id: 1,
              text: '小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学小明去上学',
              choices: [
                { id: 1, text: '好棒啊' },
                { id: 2, text: '你才棒呢' }
              ],
              answers: [
                1
              ]
            }
          },
          {
            type: 'multiple_choice_problem',
            digest: 'acbc',
            mcp: {
              id: 2,
              text: '这个不会是空',
              choices: [
                { id: 3, text: '不错啊' }
              ],
              answers: [
              ]
            }
          }
        ]
      }
    ]
  }),
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
        this.groups.push(...res.items)
        for (let i = 0; i < res.items.length; i++) {
          const group = res.items[i]
          group.problems = []
          getManageCertifications({ id: group.id }).then((res) => {
            group.problems.push(...res.items)
          })
        }
      })
    },
    addCertificationGroup() {
      this.addGrouping = true
    }
  },
  mounted() {
    this.loadDomain()
    this.loadCertificationGroups()
  }
})
</script>
