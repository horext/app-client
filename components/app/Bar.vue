<template>
  <v-app-bar flat height="72">
    <template #prepend>
      <v-app-bar-nav-icon
        aria-label="Menu Iziquierdo"
        @click.stop="toggleDrawer"
      />
    </template>
    <v-row justify="center" align="center" no-gutters>
      <v-col cols="12">
        <AppHourlyLoadInfo :hourly-load="hourlyLoad" class="pa-0" />
      </v-col>
    </v-row>
    <template #append>
      <ThemeDarkToggle v-model:dark-mode="darkMode" />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import AppHourlyLoadInfo from '~/components/app/BarHourlyLoadInfo.vue'
import ThemeDarkToggle from '~/components/app/ThemeDarkToggle.vue'
import type { IHourlyLoad } from '~/interfaces/houly-load'

defineProps<{
  hourlyLoad?: IHourlyLoad
}>()
const drawer = defineModel<boolean>('drawer', { required: true })
const darkMode = defineModel<boolean>('darkMode', { required: true })

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>
