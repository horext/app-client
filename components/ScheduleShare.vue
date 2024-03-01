<template>
  <v-card>
    <v-card-title class="d-flex">
      <span class="text-h6 font-weight-bold">Compartir</span>
      <v-spacer />
      <v-btn
        class="mx-0"
        variant="text"
        icon="mdi-close-circle-outline"
        @click="close"
      >
      </v-btn>
    </v-card-title>
    <v-list>
      <v-list-item
        :href="'https://www.facebook.com/sharer/sharer.php?u=' + link"
        target="_blank"
      >
        <template #prepend>
          <v-icon color="indigo"> mdi-facebook </v-icon>
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
          <v-icon color="cyan"> mdi-twitter </v-icon>
        </template>
        <v-card-title>Twitter</v-card-title>
      </v-list-item>
      <v-list-item
        :href="'https://api.whatsapp.com/send?text=Mira mi horario ' + link"
        target="_blank"
        data-action="share/whatsapp/share"
      >
        <template #prepend>
          <v-icon color="success"> mdi-whatsapp </v-icon>
        </template>
        <v-card-title>Whatsapp</v-card-title>
      </v-list-item>
      <v-list-item
        :href="`https://t.me/share/url?url=${link}&text=`"
        target="_blank"
        data-action="share/telegram/share"
      >
        <template #prepend>
          <v-icon color="#54a9eb"> mdi-telegram </v-icon>
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
<script lang="ts">
import { defineComponent } from 'vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export default defineComponent({
  name: 'ScheduleShare',
  props: {
    schedule: {
      type: Object as PropType<IScheduleGenerate>,
      required: true,
    },
    path: { type: String, default: '/subject' },
    dialog: { type: Boolean },
    postId: { type: Number, default: 1 },
  },
  emits: ['update:dialog'],
  data: () => ({
    copied: false,
    dialogSync: true,
  }),
  computed: {
    link() {
      return location.origin + this.path + '?q=' + this.query
    },
    query() {
      return btoa(this.schedule.scheduleSubjectIds.join(','))
    },
  },
  watch: {
    dialog(newValue) {
      this.dialogSync = newValue
    },
    dialogSync(newValue) {
      this.$emit('update:dialog', newValue)
    },
  },
  methods: {
    close() {
      this.dialogSync = false
    },
    copy() {
      const copyText = document.querySelector('#link')
      if (copyText) {
        copyText.select()
        navigator.clipboard.writeText(this.link).then(
          () => {
            /* clipboard successfully set */
            this.copied = true
          },
          function () {
            /* clipboard write failed */
          },
        )
      }
    },
  },
})
</script>
