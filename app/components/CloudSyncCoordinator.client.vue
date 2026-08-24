<template>
  <v-dialog v-model="showInitial" persistent max-width="640"
    ><v-card
      ><v-card-title>Sincronizar datos con la nube</v-card-title
      ><v-card-text
        >Encontramos datos guardados en este dispositivo. Elige cómo iniciar la
        sincronización.<v-alert v-if="errorMessage" type="error" class="mt-4">{{
          errorMessage
        }}</v-alert></v-card-text
      ><v-card-actions class="flex-wrap"
        ><v-btn :loading="busy" @click="choose('merge')">Combinar</v-btn
        ><v-btn :loading="busy" color="warning" @click="choose('replace-cloud')"
          >Reemplazar nube</v-btn
        ><v-btn :loading="busy" color="warning" @click="choose('replace-local')"
          >Reemplazar dispositivo</v-btn
        ></v-card-actions
      ></v-card
    ></v-dialog
  ><v-dialog v-model="showConflicts" max-width="760"
    ><v-card
      ><v-card-title>Conflictos de sincronización</v-card-title
      ><v-card-text
        ><v-alert v-if="errorMessage" type="error" class="mb-3">{{
          errorMessage
        }}</v-alert
        ><v-card
          v-for="conflict in conflicts"
          :key="conflict.key"
          class="mb-3"
          variant="outlined"
          ><v-card-title
            >{{ conflict.operation.resource }} ·
            {{ conflict.operation.entityId }}</v-card-title
          ><v-card-actions
            ><v-btn @click="resolve(conflict.key, 'local')">Usar local</v-btn
            ><v-btn @click="resolve(conflict.key, 'cloud')"
              >Usar nube</v-btn
            ></v-card-actions
          ></v-card
        ></v-card-text
      ></v-card
    ></v-dialog
  >
</template>
<script setup lang="ts">
import type { SyncConflict } from '~~/modules/synchronization/runtime'
import { useSynchronization } from '~/composables/cloud-sync'
const auth = useUserAuthStore(),
  facade = useSynchronization(),
  showInitial = ref(false),
  showConflicts = ref(false),
  busy = ref(false),
  errorMessage = ref<string | undefined>(),
  conflicts = ref<SyncConflict[]>([]),
  status = ref<'idle' | 'running' | 'ready' | 'error'>('idle')
async function refresh() {
  const userId = auth.user?.id
  conflicts.value = userId ? await facade.conflicts(userId) : []
  showConflicts.value = conflicts.value.length > 0
}
let runId = 0
let running: Promise<void> | undefined
let queuedUserId: string | undefined

function synchronizedKey(userId: string) {
  return `horext:cloud-initialized:${userId}`
}

async function synchronize(userId: string) {
  const currentRun = ++runId
  if (
    !localStorage.getItem(synchronizedKey(userId)) &&
    (await facade.hasLocalData(userId))
  ) {
    if (currentRun === runId) showInitial.value = true
    return
  }
  if (currentRun === runId) status.value = 'running'
  try {
    await facade.pullAndPush(userId)
    if (currentRun === runId) {
      localStorage.setItem(synchronizedKey(userId), '1')
      status.value = 'ready'
      await refresh()
    }
  } catch (error) {
    if (currentRun === runId) {
      status.value = 'error'
      errorMessage.value = syncErrorMessage(error)
    }
  }
}

function start(userId: string | undefined) {
  runId += 1
  showInitial.value = false
  showConflicts.value = false
  conflicts.value = []
  errorMessage.value = undefined
  queuedUserId = userId
  status.value = 'idle'
  if (!userId || running) return
  queuedUserId = undefined
  running = synchronize(userId).finally(() => {
    running = undefined
    if (queuedUserId) start(queuedUserId)
  })
}
async function choose(strategy: 'merge' | 'replace-cloud' | 'replace-local') {
  busy.value = true
  try {
    const userId = auth.user?.id
    if (!userId) return
    await facade.initialize(userId, strategy)
    localStorage.setItem(synchronizedKey(userId), '1')
    showInitial.value = false
    await refresh()
  } catch (error) {
    status.value = 'error'
    errorMessage.value = syncErrorMessage(error)
  } finally {
    busy.value = false
  }
}
async function resolve(key: string, choice: 'local' | 'cloud') {
  const userId = auth.user?.id
  if (!userId) return
  try {
    await facade.resolve(userId, key, choice)
    await facade.pullAndPush(userId)
    await refresh()
  } catch (error) {
    status.value = 'error'
    errorMessage.value = syncErrorMessage(error)
  }
}

function syncErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'No se pudo sincronizar. Comprueba tu conexión e inténtalo de nuevo.'
}
function synchronizeOnline() {
  start(auth.user?.id)
}

const stopUserWatch = watch(
  () => auth.user?.id,
  (userId) => start(userId),
)

onMounted(() => {
  window.addEventListener('online', synchronizeOnline)
  start(auth.user?.id)
})

onUnmounted(() => {
  runId += 1
  stopUserWatch()
  window.removeEventListener('online', synchronizeOnline)
})
</script>
