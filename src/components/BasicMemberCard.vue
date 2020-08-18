<template>
  <v-card :width="width" style="margin: 0.5em">
    <v-card-text>
      <v-col align="center">
        <div class='display-1 text--primary font-weight-bold'> 基础 </div>
      </v-col>
      <v-col align='center'>
        <div class='subheading'> 基础会员专属功能，更多影响力 </div>
      </v-col>
      <v-col align='center'>
      </v-col>
      <v-col align='center'>
        <span class="display-1 font-weight-bold text--primary"> 30 </span>
        <span class="text--primary"> 元 </span>
        <span class="text--primary"> /月 </span>
      </v-col>
    </v-card-text>
    <v-card-actions>
      <v-col align="center">
        <v-btn
          large
          color="primary"
          block
          :to="{ path: '/person'}"
          class="white--text"
        >
          {{ buttonText }}
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'

export default Vue.extend({
  name: 'FreeMemberCard',
  props: {
    width: {
      type: Number,
      required: true
    }
  },
  methods: {
    onSubmit() {
      this.$emit('confirm')
    }
  },
  computed: {
    buttonText() {
      if (UserModule.isLoggedIn) {
        return '即刻升级'
      } else {
        return '注册获取'
      }
    }
  }
})
</script>
