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
          <v-overlay :dark="dark">
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
                    <v-text-field
                      label="用户名"
                      v-model="username"
                      :rules="usernameRules"
                      required
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      label="密码"
                      v-model="password"
                      min="8"
                      :append-icon="e1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      @click:append="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      :rules="passwordRules"
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
                      >登录</v-btn>
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
      password: '',
      passwordRules: [(v) => !!v || '请填写密码'],
      username: '',
      usernameRules: [(v) => !!v || '请填写用户名']
    }
  },
  computed: {
    dark() {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        await UserModule.Login({
          username: this.username,
          password: this.password
        })
        if (UserModule.username !== '' && UserModule.refreshToken !== '') {
          this.$router.replace(this.$route.query.nextUrl)
        }
      }
    },
    clear() {
      this.$refs.form.reset()
    }
  }
})
</script>
