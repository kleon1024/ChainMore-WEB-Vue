<template>
  <v-container>
    <v-row>
      <FreeMemberCard/>
      <BasicMemberCard/>
      <ProfessionalMemberCard/>
      <OneMemberCard/>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import FreeMemberCard from '@/components/FreeMemberCard.vue'
import BasicMemberCard from '@/components/BasicMemberCard.vue'
import ProfessionalMemberCard from '@/components/ProfessionalMemberCard.vue'
import OneMemberCard from '@/components/OneMemberCard.vue'

export default Vue.extend({
  name: 'Resource',
  components: {
    FreeMemberCard,
    BasicMemberCard,
    ProfessionalMemberCard,
    OneMemberCard
  }
})
</script>
