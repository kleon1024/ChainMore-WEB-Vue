<template>
  <v-card>
    <v-card-text>
      <v-col align="center">
        <div
          v-if="domain"
          class='display-1 text--primary font-weight-bold'
        > {{ domain.title }} </div>
      </v-col>
      <v-col align='center'>
        <div class='title text--primary'> {{ tips }} </div>
      </v-col>
      <v-col align='center'>
        <v-icon
          size="180"
          color="primary"
        > mdi-infinity </v-icon>
      </v-col>
    </v-card-text>
    <v-card-actions>
      <v-col align="center">
        <v-btn
          text
          color="primary"
          outlined
          block
          @click="onSubmit"
        >
          认证
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'NoCertifyCard',
  props: {
    tips: {
      type: String,
      required: true
    },
    domain: {
      required: true
    }
  },
  methods: {
    onSubmit() {
      this.$emit('certify')
    }
  }
})
</script>
