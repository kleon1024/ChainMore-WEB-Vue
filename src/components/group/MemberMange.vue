<template>
  <v-list dense>
    <v-list-item
      v-for="member in members"
      :key="`member${member.username}`"
    >
      <v-list-item-title class="subtitle font-weight-bold text--primary"> {{ member.username }}</v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-autocomplete
        dense
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="username"
        item-value="username"
        placeholder="邀请成员"
        return-object
      ></v-autocomplete>
    </v-list-item>
  </v-list>
</template>

<script>
import Vue from 'vue'
import { search } from '@/api/main'
import { PersonModule } from '@/store/modules/person'
import { readableTimestamp } from '@/utils/time'

export default Vue.extend({
  name: 'ActionList',
  components: {},
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model: '',
      items: [],
      isLoading: false,
      search: ''
    }
  },
  methods: {
    readableTime(val) {
      return readableTimestamp(val)
    }
  },
  computed: {
    members() {
      return this.group.members === undefined ? [] : this.group.members
    }
  },
  watch: {
    search(val) {
      if (val === null) return
      if (val.trim() === '') return
      if (this.isLoading) return
      this.isLoading = true

      search({ type: 'user', query: val })
        .then((res) => {
          this.items = res.items
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    model(val) {
      if (val === null) return
      if (val.username === undefined) return
      this.$confirm(`确认邀请${val.username}加入团队?`).then((res) => {
        if (res) {
          PersonModule.AddGroupMember({
            group: this.group,
            user: val,
            success: () => {
              this.search = ''
              this.model = {}
            }
          })
        }
      })
    }
  }
})
</script>
