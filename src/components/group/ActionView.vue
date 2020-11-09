<template>
  <div>
    <v-form
      v-model="valid"
      ref="form"
      @submit.native.prevent
    >
      <v-bottom-sheet v-model="showAddAction">
        <v-list>
          <v-list-item>
            <v-list-item-title class="subtitle-2 text--primary font-weight-bold">
              规划行动
            </v-list-item-title>
            <v-list-item-action>
              <v-btn
                color="primary"
                elevation="0"
                small
                @click="onClickAddActionButton"
                v-if="!locks.addAction"
              >
                添加
              </v-btn>
              <v-progress-circular
                v-if="locks.addAction"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-text-field
              autofocus
              v-model="form.actionTitle"
              :counter="counter.actionTitle"
              :rules="rules.actionTitle"
              label="行动代号"
              required
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-autocomplete
              v-model="form.agg"
              :items="group.actions"
              item-text="title"
              item-value="id"
              chips
              small-chips
              label="关联上级行动"
            >
              <template v-slot:selection="data">
                <v-chip
                  :elevation="0"
                  dense
                  small
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  @click="data.select"
                >
                  <div class="text--primary subtitle-2 display: inline-block text-truncate"> {{ data.item.title }} </div>
                </v-chip>
              </template>
            </v-autocomplete>
          </v-list-item>
          <div class="pa-8"></div>
        </v-list>
      </v-bottom-sheet>
      <v-toolbar
        elevation="0"
        dense
      >
        <TooltipIconButton
          str="mdi-plus"
          tip="规划行动"
          text
          icon
          small
          @click="onClickAddAction"
        />
        <v-spacer></v-spacer>
        <TooltipIconButton
          str="mdi-format-list-bulleted"
          tip="平铺所有"
          text
          icon
          small
          :color="showMode === 1 ? 'primary': 'text'"
          @click="showMode = 1"
        />
        <TooltipIconButton
          str="mdi-file-tree-outline"
          tip="树状结构"
          text
          icon
          small
          :color="showMode === 2 ? 'primary': 'text'"
          @click="showMode = 2"
        />
      </v-toolbar>
      <ActionList
        :group="group"
        :expandable="showMode === 2"
        v-if="showMode === 1 || showMode === 2"
      />
    </v-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'
import { searchQuery } from '@/utils/search'
import TooltipIconButton from '@/components/buttons/TooltipIconButton.vue'
import ActionList from '@/components/group/ActionList.vue'

export default Vue.extend({
  name: 'ActionView',
  components: {
    TooltipIconButton,
    ActionList
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      valid: false,
      locks: {
        addAction: false
      },
      showMode: 1,
      showAddAction: false,
      form: {
        actionTitle: '',
        agg: []
      },
      counter: {
        actionTitle: 32
      },
      rules: {
        actionTitle: [
          (v) => !!v.trim() || '代号不能为空',
          (v) => v.length < this.counter.actionTitle || '请精简的代号长度'
        ]
      }
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    onClickAddAction() {
      this.showAddAction = true
    },
    onClickAddActionButton() {
      if (this.$refs.form.validate()) {
        if (!this.locks.addAction) {
          this.locks.addAction = true
          const aggs = this.form.agg === undefined ? [] : (this.form.agg.length === 0 ? [] : [this.form.agg])
          PersonModule.CreateAction({
            title: this.form.actionTitle.trim(),
            aggs: aggs,
            group: this.group,
            success: () => {
              this.showAddAction = false
              this.form.actionTitle = ''
              this.form.agg = []
              this.locks.addAction = false
            },
            failed: () => {
              this.locks.addAction = false
            }
          })
        }
      }
    }
  },
  watch: {
    // query(val) {
    //   this.searchedDomains.splice(0, this.searchedDomains.length)
    //   this.searchedDomains.push(
    //     ...searchQuery(val, PersonModule.domains,
    //       (r, q) => r.title.toLowerCase().includes(q) || r.intro.toLowerCase().includes(q)))
    // }
  }
})
</script>
