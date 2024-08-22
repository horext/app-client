<template>
  <v-card>
    <v-card-title class="d-flex">
      <span class="text-h6 font-weight-bold">Compartir</span>
      <v-spacer />
      <v-btn
        class="mx-0"
        variant="text"
        :icon="mdiCloseCircleOutline"
        @click="close"
      />
    </v-card-title>
    <v-list>
      <v-list-item
        :href="'https://www.facebook.com/sharer/sharer.php?u=' + link"
        target="_blank"
      >
        <template #prepend>
          <v-icon color="indigo">
            {{ mdiFacebook }}
          </v-icon>
        </template>
        <v-card-title>Facebook</v-card-title>
      </v-list-item>
      <v-list-item
        :href="
          'http://twitter.com/share?text=Mira mi horario &url=' +
          link +
          '&hashtags=octatec,horext'
        "
        target="_blank"
      >
        <template #prepend>
          <v-icon color="cyan">
            {{ mdiTwitter }}
          </v-icon>
        </template>
        <v-card-title>Twitter</v-card-title>
      </v-list-item>
      <v-list-item
        :href="'https://api.whatsapp.com/send?text=Mira mi horario ' + link"
        target="_blank"
        data-action="share/whatsapp/share"
      >
        <template #prepend>
          <v-icon color="success">
            {{ mdiWhatsapp }}
          </v-icon>
        </template>
        <v-card-title>Whatsapp</v-card-title>
      </v-list-item>
      <v-list-item
        :href="`https://t.me/share/url?url=${link}&text=`"
        target="_blank"
        data-action="share/telegram/share"
      >
        <template #prepend>
          <v-icon color="#54a9eb">
            {{ mdiSendCheck }}
          </v-icon>
        </template>
        <v-card-title>Telegram</v-card-title>
      </v-list-item>
    </v-list>
    <v-text-field
      id="link"
      ref="link"
      :label="copied ? 'Enlace copiado' : 'Click to copiar el link'"
      class="pa-4"
      readonly
      :model-value="link"
      @click="copy"
    />
  </v-card>
</template>
<script setup lang="ts">
import type { IScheduleGenerate } from '~/interfaces/schedule'
import {
  mdiFacebook,
  mdiTwitter,
  mdiWhatsapp,
  mdiSendCheck,
  mdiCloseCircleOutline,
} from '@mdi/js'

defineOptions({
  name: 'ScheduleShare',
})
const props = defineProps({
  schedule: {
    type: Object as PropType<IScheduleGenerate>,
    required: true,
  },
  path: { type: String, default: '/subject' },
  dialog: { type: Boolean },
  postId: { type: Number, default: 1 },
})
const emit = defineEmits(['update:dialog'])

const { schedule, path, dialog } = toRefs(props)

const copied = ref(false)
const dialogSync = ref(true)

const link = computed(() => location.origin + path.value + '?q=' + query.value)

const query = computed(() => btoa(schedule.value.scheduleSubjectIds.join(',')))

watch(dialog, (newValue) => {
  dialogSync.value = newValue
})

watch(dialogSync, (newValue) => {
  emit('update:dialog', newValue)
})

const close = () => {
  dialogSync.value = false
}

const copy = () => {
  const copyText = document.querySelector<HTMLInputElement>('#link')
  if (copyText) {
    copyText.select()
    navigator.clipboard.writeText(link.value).then(
      () => {
        copied.value = true
      },
      function () {},
    )
  }
}
</script>
