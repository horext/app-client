<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <home-app-bar :is-logged-in="authStore.isLoggedIn" @click:invert-mode="invertMode" />
  <home-view>
    <slot />
  </home-view>
  <home-footer />
</template>

<script setup lang="ts">
import { provideApi } from '~~/modules/apis/runtime'
import { STUDY_PLAN_API_KEY } from '~~/modules/apis/runtime/registry/keys'
import { StudyPlanApi } from '~~/modules/apis/runtime/resources/studyPlan'

provideApi(STUDY_PLAN_API_KEY, StudyPlanApi)

const authStore = useUserAuthStore()

const settingsStore = useSettingsStore()

const invertMode = () => {
  settingsStore.toggleDarkMode()
}
</script>
