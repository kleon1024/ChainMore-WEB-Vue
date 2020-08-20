<template>
  <v-container fluid fill-height>
    <AppBar />
    <v-row
      align='center'
      justify='center'
    >
      <FreeMemberCard :width="width / 2.5" />
      <BasicMemberCard :width="width / 2.5" />
      <ProfessionalMemberCard :width="width / 2.5" />
      <OneMemberCard :width="width / 2.5" />
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import AppBar from '@/components/AppBar.vue'
import FreeMemberCard from '@/components/FreeMemberCard.vue'
import BasicMemberCard from '@/components/BasicMemberCard.vue'
import ProfessionalMemberCard from '@/components/ProfessionalMemberCard.vue'
import OneMemberCard from '@/components/OneMemberCard.vue'

export default Vue.extend({
  name: 'Resource',
  components: {
    AppBar,
    FreeMemberCard,
    BasicMemberCard,
    ProfessionalMemberCard,
    OneMemberCard
  },
  computed: {
    width() {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width > height) {
        return width * 0.382
      } else {
        return width * 0.9
      }
    }
  }
})
</script>
