<template>
  <v-container fluid>
    <ResourcePanel class="mb-2" />
    <CollectionPanel class="mb-2"/>
    <DomainPanel class="mb-2"/>
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
  },
  mounted() {
    document.title = '个人中心 - 阡陌'
  }
}
</script>
