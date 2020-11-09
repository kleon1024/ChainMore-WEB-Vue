<template>
  <v-app id="create-domain">
    <v-main>
      <v-container>
        <v-card>
          <v-card-text>
            <p class='display-1 text--primary'> 创建团队 </p>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="form.title"
                :counter="counter.title"
                :rules="rules.title"
                label="团队名称"
                outlined
                dense
                required
              ></v-text-field>
              <v-btn
                block
                outlined
                color="primary"
                @click="submit"
              >
                创建
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import {
  createGroup
} from '@/api/groups'

export default Vue.extend({
  name: 'DomainCreate',
  data() {
    return {
      valid: true,
      form: {
        title: ''
      },
      counter: {
        title: 16
      },
      domainExist: false,
      rules: {
        title: [
          (v) => !!v.trim() || '标题不能为空',
          (v) =>
            (v && v.length <= this.counter.title) ||
            `标题必须小于${this.counter.title}个字符`
        ]
      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        createGroup({
          title: this.form.title
        }).then((res) => {
          if (res.items.length === 1) {
            this.$router.back()
          }
        })
      }
    }
  }
})
</script>
