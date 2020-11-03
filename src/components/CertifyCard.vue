<template>
  <v-card
    :elevation="emphase ? 3 : 1"
    @click="toggle"
  >
    <v-card-text class="text-center">
      <p
        style='white-space: pre-wrap;'
        class='text-truncate'
      > {{ group.title }} </p>
      <v-icon
        size="180"
        color="primary"
      > {{ iconText }} </v-icon>
    </v-card-text>
    <v-card-actions class="text-center align-center">
      <v-btn
        text
        color="primary"
        outlined
        block
        :to="to"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CertifyCard',
  props: {
    to: {
      type: Object
    },
    domain: {
      required: true
    },
    group: {
      required: true
    },
    emphase: {
      type: Boolean,
      default: false
    },
    toggle: {
      required: true
    }
  },
  computed: {
    buttonText() {
      return this.group.finished ? '重新挑战' : '开始挑战'
    },
    iconText() {
      return this.group.finished ? 'mdi-check' : 'mdi-sword'
    }
  }
})
</script>
