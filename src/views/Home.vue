<template>
  <div class='home'>
    <AggregateCard />
    <!-- <DependCard /> -->
    <DomainGroup />
  </div>
</template>

<script>
// @ is an alias to /src
import AggregateCard from '@/components/AggregateCard.vue'
// import DependCard from '@/components/DependCard.vue'
import DomainGroup from '@/components/DomainGroup.vue'

export default {
  name: 'Home',
  components: {
    AggregateCard,
    // DependCard,
    DomainGroup
  }
}
</script>
