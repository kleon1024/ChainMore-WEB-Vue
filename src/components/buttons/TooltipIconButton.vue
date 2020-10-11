<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        icon
        x-small
        v-bind="attrs"
        v-on="on"
        @click="click"
      >
        <v-icon>
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
    <span> {{ tip }} </span>
  </v-tooltip>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'TooltipIconButton',
  props: {
    icon: {
      type: String,
      default: 'mdi-check'
    },
    tip: {
      type: String
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
})
</script>
