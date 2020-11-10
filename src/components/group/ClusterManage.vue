<template>
  <div>
    <v-bottom-sheet v-model="showAddCluster">
    <v-form
      v-model="valid"
      ref="clusterForm"
      @submit.native.prevent
    >
        <v-list>
          <v-list-item>
            <v-list-item-title class="subtitle-2 text--primary font-weight-bold">
              添加预设
            </v-list-item-title>
            <v-list-item-action>
              <v-btn
                color="primary"
                elevation="0"
                small
                @click="onClickAddClusterButton"
                v-if="!locks.addCluster"
              >
                添加
              </v-btn>
              <v-progress-circular
                v-if="locks.addCluster"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-text-field
              autofocus
              v-model="form.clusterTitle"
              :counter="counter.clusterTitle"
              :rules="rules.clusterTitle"
              label="属性名称"
              required
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-select
              :items="clusterTypes"
              label="属性类型"
              v-model="form.clusterType"
              :menu-props="{ top: true, offsetY: true }"
            >
            </v-select>
          </v-list-item>
          <v-list-item>
            <v-switch v-model="form.clusterAggregate"
              label="向上聚合"
            >
            </v-switch>
          </v-list-item>
          <div class="pa-8"></div>
        </v-list>
      </v-form>
    </v-bottom-sheet>
    <v-form
      v-model="valid" ref="attrForm" @submit.native.prevent>
    <v-list dense>
      <v-list-group
       v-for="cluster in clusters"
       :key="cluster.id"
       v-model="cluster.active"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ cluster.title }}
              <v-btn
                class="ml-3"
                text
                outlined
                x-small
              >
                {{ cluster.type }}
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="attr in cluster.attrs"
          :key="`attr${attr.id}`"
          color="red"
        >
          <v-list-item-title>
            <v-btn
              x-small
              elevation="0"
              outlined
              :color="attrColor(attr.color)"
            >
              <span class="text--primary"> {{ attr.text }} </span>
            </v-btn>
          </v-list-item-title>
          <v-list-item-action>
            <TooltipIconButton
              str="mdi-trash-can-outline"
              tip="删除"
              text
              icon
              x-small
              @click="onClickDeleteAttributeButton(attr)"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-if="!showAddClusterAttribute">
          <v-btn
            block
            outlined
            text
            @click="onClickAddClusterAttributeButton(cluster)"
          >
            添加预设
          </v-btn>
        </v-list-item>
        <v-list-item v-if="!showAddClusterAttribute">
          <v-btn
            block
            outlined
            text
            @click="onClickDeleteClusterAttributeButton(cluster)"
          >
            删除属性
          </v-btn>
        </v-list-item>
        <v-list-item v-if="showAddClusterAttribute && addingClusterId === cluster.id">
          <v-list-item-title
            class="subtitle-2"
          >
            <v-text-field
              autofocus
              v-model="form.clusterAttribute"
              :counter="counter.clusterAttribute"
              :rules="rules.clusterAttribute"
              required
              @blur="onBlurClusterAttributeTextField"
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
      </v-list-group>
      <div class="ma-3"></div>
      <v-list-item>
      <v-btn
        v-if="!showAddCluster"
        block color="primary" elevation="0"
        @click="onClickCreateCluster"
      >
        创建属性
      </v-btn>
      </v-list-item>
    </v-list>
    </v-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { GlobalModule } from '@/store/modules/global'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'

export default Vue.extend({
  name: 'Cluster',
  components: {
    TooltipIconButton
  },
  props: {
    group: {
      type: Object
    },
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showAddClusterAttribute: false,
      showAddCluster: false,
      addingClusterId: 0,
      addingClusterType: '',
      valid: false,
      locks: {
        addCluster: false
      },
      form: {
        clusterTitle: '',
        clusterType: 'text',
        clusterAggregate: true,
        clusterAttribute: ''
      },
      counter: {
        clusterTitle: 16,
        clusterAttribute: 16
      },
      rules: {
        clusterTitle: [
          (v) => !!v.trim() || '属性名称不能为空',
          (v) => v.length < this.counter.clusterTitle || '请精简属性名称'
        ],
        clusterAttribute: [
          (v) => !!v.trim() || '预设不能为空',
          (v) => {
            if (this.addingClusterType === 'numeric') {
              const num = /^[0-9.]+$/
              if (!num.test(v)) return 'numeric类型属性只能输入数字'
            }
            return true
          },
          (v) => {
            for (let i = 0; i < this.currentCluster.attrs.length; i++) {
              const attr = this.currentCluster.attrs[i]
              if (attr.text === v.trim()) return '预设已存在'
            }
            return true
          }
        ]
      }
    }
  },
  methods: {
    attrColor(color) {
      return `#${color.toString(16)}`
    },
    readableTime(val) {
      return readableTimestamp(val)
    },
    onClickCreateCluster() {
      this.showAddCluster = true
    },
    onClickAddClusterButton() {
      if (this.$refs.clusterForm.validate()) {
        if (!this.locks.addCluster) {
          this.locks.addCluster = true
          PersonModule.CreateCluster({
            title: this.form.clusterTitle.trim(),
            group: this.group,
            type: this.form.clusterType,
            aggregate: this.form.clusterAggregate ? 1 : 0,
            success: () => {
              this.showAddCluster = false
              this.locks.addCluster = false
              this.form.clusterTitle = ''
            },
            failed: () => {
              this.locks.addCluster = false
            }
          })
        }
      }
    },
    onClickAddClusterAttributeButton(cluster) {
      this.clearAllStatus()
      this.showAddClusterAttribute = true
      this.addingClusterId = cluster.id
      this.addingClusterType = cluster.type
    },
    onBlurClusterAttributeTextField() {
      if (this.$refs.attrForm.validate()) {
        PersonModule.CreateClusterAttribute({
          group: this.group,
          cluster: this.addingClusterId,
          text: this.form.clusterAttribute,
          success: () => {
            this.form.clusterAttribute = ''
            this.clearAllStatus()
          }
        })
      }
    },
    onClickDeleteAttributeButton(attr) {
      this.$confirm('确认删除预设？一旦删除将无法恢复').then((res) => {
        if (res) {
          PersonModule.RemoveClusterAttribute({ attr: attr, group: this.group })
        }
      })
    },
    onClickDeleteClusterAttributeButton(cluster) {
      this.$confirm('确认删除属性？一旦删除将无法恢复').then((res) => {
        if (res) {
          PersonModule.DeleteCluster({ cluster: cluster, group: this.group })
        }
      })
    },
    clearAllStatus() {
      this.showAddClusterAttribute = false
      this.addingClusterId = 0
      this.showAddCluster = false
      this.addingClusterType = ''
    }
  },
  computed: {
    currentCluster() {
      for (let i = 0; i < this.clusters.length; i++) {
        if (this.clusters[i].id === this.addingClusterId) {
          return this.clusters[i]
        }
      }
      return {}
    },
    clusters() {
      return this.group.clusters
    },
    clusterTypes() {
      return GlobalModule.clusterTypes
    },
    clusterAttribute: {
      get: function() {
        return this.form.clusterAttribute
      },
      set: function(val) {
        this.form.clusterAttribute = val.replace(/[^\d]/g, '')
      }
    }
  }
})
</script>
