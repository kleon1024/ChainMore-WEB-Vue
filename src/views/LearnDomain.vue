<template>
  <v-container fluid>
    <v-stepper
      vertical
      v-model="step"
      class="elevation-0"
    >
      <template v-for="(domain, index) in dependDomains">
        <v-stepper-step
          :key="`${index}-step`"
          :complete="domain.certified"
          :step="index"
        >
          <v-row>
            <v-btn text @click="onClickDomain(index)">
              {{ domain.title }}
            </v-btn>
            <TooltipIconButton
              text
              outlined
              v-if="domain.certified"
              str="已认证"
              tip="已掌握并获得认证"
            />
            <TooltipIconButton
              text
              outlined
              color="grey"
              v-if="!domain.certified && domain.skip"
              str="跳过"
              tip="根据认证推测已掌握"
            />
            <TooltipIconButton
              text
              outlined
              color="primary"
              v-if="!domain.skip && domain.recommend"
              str="推荐"
              tip="根据认证推荐学习"
            />
          </v-row>
        </v-stepper-step>
        <v-stepper-content
          :key="`${index}-content`"
          :step="index"
        >
          <v-card>
            <v-card-actions>
              <v-btn text outlined>
                <a target="_blank" :href="'/explore/domain/' + domain.id">
                  查看领域
                </a>
              </v-btn>
            </v-card-actions>
            <v-card-text>
              {{ domain.description}}
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </template>
    </v-stepper>
    <v-card elevation="0">
      <v-card-actions>
        <v-btn block outlined @click="unlearnDomain">
          放弃学习
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'
import {
  unlearn,
  getDomain,
  getDependedDomains
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
      domain: null,
      step: 0,
      dependDomains: []
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    },
    loadDomain() {
      getDomain({
        id: this.$route.params.id
      }).then((res) => {
        this.domain = res.items[0]
      })
    },
    loadDependDomains() {
      getDependedDomains({ id: this.$route.params.id, distance: 999 }).then(
        (res) => {
          this.dependDomains.splice(0, this.dependDomains.length)
          this.dependDomains.push(...res.items)
        }
      )
    },
    onClickDomain(index) {
      this.step = index
      if (this.dependDomains[index].collections === undefined) {
      }
    },
    unlearnDomain() {
      unlearn({ domain: this.domain.id }).then((res) => {
        if (res.items.length === 1) {
          this.$router.replace({ path: '/person' })
        }
      })
    }
  },
  mounted() {
    this.loadDomain()
    this.loadDependDomains()
  }
})
</script>
