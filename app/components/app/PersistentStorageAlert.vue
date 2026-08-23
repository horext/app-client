<template>
  <v-alert
    v-if="visible"
    class="mx-auto mt-2 storage-protection-alert"
    closable
    color="info"
    density="compact"
    :icon="mdiShieldCheckOutline"
    :title="title"
    variant="tonal"
    @click:close="remindLater"
  >
    <div class="text-body-2">{{ message }}</div>
    <div class="mt-2 d-flex justify-end ga-1">
      <v-btn size="small" variant="text" @click="remindLater">Ahora no</v-btn>
      <v-btn
        color="info"
        :loading="requesting"
        size="small"
        variant="flat"
        @click="request"
      >
        Proteger
      </v-btn>
    </div>
  </v-alert>

  <v-snackbar
    :model-value="requestFailed"
    class="storage-protection-notice"
    color="warning"
    location="bottom end"
    :timeout="8000"
    @update:model-value="dismissFailure"
  >
    {{ failureMessage }}
    <template #actions>
      <v-btn variant="text" @click="dismissRequestFailure">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { mdiShieldCheckOutline } from '@mdi/js'

const subjectsStore = useUserSubjectsStore()
const favoritesStore = useUserFavoritesStore()
const eventsStore = useUserEventsStore()
const generationStore = useGenerationStore()
const profileStore = useUserProfileStore()

const hasMeaningfulData = computed(
  () =>
    subjectsStore.subjects.length > 0 ||
    favoritesStore.favoritesSchedules.length > 0 ||
    eventsStore.items.length > 0 ||
    generationStore.history.length > 0 ||
    generationStore.result !== null ||
    profileStore.setupCompleted,
)

const {
  protectionLost,
  isStandalone,
  requesting,
  requestFailed,
  check,
  request,
  dismissRequestFailure,
  remindLater,
  shouldPrompt,
} = usePersistentStorage()
const visible = shouldPrompt(hasMeaningfulData)
const title = computed(() =>
  protectionLost.value ? 'Protección desactivada' : 'Evita perder tus datos',
)
const message = computed(() =>
  protectionLost.value
    ? 'El navegador dejó de proteger los datos guardados en este dispositivo.'
    : 'Solicita al navegador que conserve tus horarios y preferencias aunque necesite espacio.',
)
const failureMessage = computed(() =>
  isStandalone.value
    ? 'Chrome no la concedió por ahora. Podrás intentarlo más adelante.'
    : 'Instala y abre Horext como aplicación antes de volver a intentarlo.',
)

const dismissFailure = (open: boolean) => {
  if (!open) dismissRequestFailure()
}

const checkWhenVisible = () => {
  if (document.visibilityState === 'visible') void check()
}

onMounted(() => {
  void check()
  document.addEventListener('visibilitychange', checkWhenVisible)
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', checkWhenVisible)
})
</script>

<style scoped>
.storage-protection-notice :deep(.v-snackbar__wrapper) {
  max-width: 440px;
}

.storage-protection-alert {
  width: calc(100% - 24px);
  max-width: 900px;
}
</style>
