<template>
  <v-card class="ma-2">
    <v-card-text>
      <v-col align="center">
        <div class='display-1 text--primary font-weight-bold'> 定制 </div>
      </v-col>
      <v-col align='center'>
        <div class='subheading'> 量身定制工具，支持与服务 </div>
      </v-col>
      <v-col align='center'>
      </v-col>
      <v-col align='center'>
        <span class="display-1 font-weight-bold text--primary"> </span>
        <span class="text--primary"> 定制合同 </span>
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
        return '咨询销售'
      } else {
        return '咨询销售'
      }
    }
  }
})
</script>
