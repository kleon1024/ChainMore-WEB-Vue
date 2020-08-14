<template>
  <v-container>
    <ResourcePanel />
    <CollectionPanel />
    <DomainPanel />
  </v-container>
</template>

<script>
import ResourcePanel from '@/components/ResourcePanel.vue'
import CollectionPanel from '@/components/CollectionPanel.vue'
import DomainPanel from '@/components/DomainPanel.vue'

export default {
  name: 'Home',
  components: {
    ResourcePanel,
    CollectionPanel,
    DomainPanel
  }
}
</script>
