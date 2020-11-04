<template>
  <v-app id="login">
    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          flex
          align-center
          justify-center
        >
          <AggregateCard />
          <v-overlay>
            <v-card>
              <v-card-text class="pt-4">
                <div>
                  <p
                    class="headline font-weight-bold primary--text"
                    align="center"
                  > 阡陌 </p>
                  <v-form
                    v-model="valid"
                    ref="form"
                  >
                    <p
                      class="title primary--text"
                      align="center"
                    >
                      你好，{{ username }}
                    </p>
                    <v-text-field
                      label="当前密码"
                      v-model="oldPassword"
                      min="8"
                      :append-icon="e1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      @click:append="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      :rules="passwordRules"
                      counter
                      outlined
                      dense
                      required
                    ></v-text-field>
                    <v-text-field
                      label="新密码"
                      v-model="newPassword"
                      min="8"
                      :append-icon="e1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      @click:append="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      :rules="newPasswordRules"
                      counter
                      outlined
                      dense
                      required
                    ></v-text-field>
                    <v-text-field
                      label="再次输入新密码"
                      v-model="newPasswordConfirm"
                      min="8"
                      :append-icon="e1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      @click:append="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      :rules="newPasswordConfirmRules"
                      counter
                      outlined
                      dense
                      required
                    ></v-text-field>
                    <v-layout justify-space-between>
                      <v-btn
                        @click="submit"
                        :class=" { 'teal white--text' : valid, disabled: !valid }"
                        block
                        outlined
                      >修改密码</v-btn>
                    </v-layout>
                  </v-form>
                </div>
              </v-card-text>
            </v-card>
          </v-overlay>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
import AggregateCard from '@/components/AggregateCard.vue'

export default Vue.extend({
  name: 'Login',
  components: {
    AggregateCard
  },
  data() {
    return {
      valid: false,
      e1: true,
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      passwordRules: [(v) => !!v || '请填写密码'],
      newPasswordRules: [
        (v) => !!v || '请填写密码',
        (v) =>
          this.newPassword !== this.oldPassword || '新密码不能和当前密码一致'
      ],
      newPasswordConfirmRules: [
        (v) => !!v || '请确认新密码',
        (v) =>
          this.newPasswordConfirm === this.newPassword || '两次密码输入不一致'
      ]
    }
  },
  computed: {
    username() {
      return UserModule.username
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        await UserModule.ChangePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          success: () => {
            this.$toasted.show('成功修改密码，请重新登录')
            this.$router.push({
              path: '/login',
              nextUrl: this.$route.query.nextUrl
            })
          },
          failed: () => {
            this.$toasted.show('修改密码失败，请稍后尝试')
            if (!UserModule.isLoggedIn) {
              this.$router.push({
                path: '/login',
                nextUrl: this.$route.query.nextUrl
              })
            }
          }
        })
      }
    },
    clear() {
      this.$refs.form.reset()
    }
  },
  watch: {
    oldPassword(val) {
      console.log('old' + val)
    },
    newPassword(val) {
      console.log('new' + val)
      console.log(this.newPassword !== this.oldPassword)
    }
  }
})
</script>
