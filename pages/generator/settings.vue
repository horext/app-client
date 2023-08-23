<template>
  <v-container>
    <v-card>
      <SettingInitial />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SettingInitial from '~/components/setting/Initial.vue'
export default defineComponent({
  name: 'Advance',
  components: {
    SettingInitial,
  },
})
</script>
