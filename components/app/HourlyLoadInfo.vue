<template>
  <v-list-item lines="three" density="compact">
    <template v-if="hourlyLoad">
      {{ hourlyLoad.name }}
      <v-list-item-subtitle>
        Ult. Actual.: {{ new Date(hourlyLoad.updatedAt).toLocaleString() }}
      </v-list-item-subtitle>
    </template>
    <template v-else>
      <v-list-item-subtitle> Sin carga horaria. </v-list-item-subtitle>
    </template>
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
