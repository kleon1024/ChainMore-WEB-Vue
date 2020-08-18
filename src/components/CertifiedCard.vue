<template>
  <v-card :width="width">
    <v-card-text>
      <v-col align="center">
        <div
          v-if="domain"
          class='display-1 text--primary font-weight-bold'
        > {{ domain.title }} </div>
      </v-col>
      <v-col align='center'>
        <div class='title text--primary'> 你已完成认证 </div>
      </v-col>
      <v-col align='center'>
        <v-icon
          size="180"
          color="primary"
        > mdi-check </v-icon>
      </v-col>
    </v-card-text>
    <v-card-actions>
      <v-col align="center">
        <v-btn
          text
          color="teal"
          outlined
          block
          @click="onSubmit"
        >
          确认
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CertifiedCard',
  props: {
    width: {
      type: Number,
      required: true
    },
    domain: {
      required: true
    }
  },
  methods: {
    onSubmit() {
      this.$emit('confirm')
    }
  }
})
</script>
