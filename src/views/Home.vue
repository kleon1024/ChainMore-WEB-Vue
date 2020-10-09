<template>
  <v-container fluid>
    <ResourcePanel class="my-2 mx-2" />
    <CollectionPanel class="my-2 mx-2"/>
    <DomainPanel class="my-2 mx-2"/>
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
