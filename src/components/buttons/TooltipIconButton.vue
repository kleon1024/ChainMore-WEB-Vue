<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :text="text"
        :icon="icon"
        :medium="medium"
        :small="small"
        :x-small="xSmall"
        :outlined="outlined"
        :color="color"
        v-bind="attrs"
        v-on="on"
        @click="click"
      >
        <v-icon v-if="icon">
          {{ str }}
        </v-icon>
        <div v-if="!icon"> {{ str }} </div>
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
    str: {
      type: String,
      default: 'mdi-check'
    },
    tip: {
      type: String
    },
    text: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    xSmall: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    color: {
      type: String
    },
    medium: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
})
</script>
