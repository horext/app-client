<template>
  <v-list-item three-line dense>
    <v-list-item-content v-if="hourlyLoad">
      {{ hourlyLoad.name }}
      <v-list-item-subtitle>
        Ult. Actual.: {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content v-else>
      <v-list-item-subtitle> Sin carga horaria. </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import { useUserConfigStore } from '~/stores/user-config'

export default defineComponent({
  setup() {
    const store = useUserConfigStore()
    const { hourlyLoad } = storeToRefs(store)
    return {
      hourlyLoad,
    }
  },
})
</script>
