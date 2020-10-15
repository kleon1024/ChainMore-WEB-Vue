<template>
  <v-card class="ma-2">
    <v-card-text>
      <v-col align="center">
        <div class='display-1 text--primary font-weight-bold'> 专业 </div>
      </v-col>
      <v-col align='center'>
        <div class='subheading'> 企业/专业用户功能，更高响应优先级 </div>
      </v-col>
      <v-col align='center'>
      </v-col>
      <v-col align='center'>
        <span class="display-1 font-weight-bold text--primary"> 999 </span>
        <span class="text--primary"> 元 </span>
        <span class="text--primary"> 每人/月 </span>
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
