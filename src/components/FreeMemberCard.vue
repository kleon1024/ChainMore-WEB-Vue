<template>
  <v-card class="ma-2">
    <v-card-text>
      <v-col align="center">
        <div class='display-1 text--primary font-weight-bold'> 免费 </div>
      </v-col>
      <v-col align='center'>
        <div class='subheading'> 什么也没有 </div>
      </v-col>
      <v-col align='center'>
      </v-col>
      <v-col align='center'>
        <span class="display-1 font-weight-bold text--primary"> 0 </span>
        <span class="text--primary"> 元 </span>
        <span class="text--primary"> /月 </span>
      </v-col>
    </v-card-text>
    <v-card-actions>
      <v-col align="center">
        <v-btn
          large
          color="teal"
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
        return '开始探索'
      } else {
        return '立即注册'
      }
    }
  }
})
</script>
