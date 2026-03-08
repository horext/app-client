<template>
  <v-tooltip text="Exporta los eventos de tu horario a Google Calendar" location="top">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        variant="outlined"
        rounded
        class="ma-1"
        density="compact"
        :loading="loading"
        :disabled="loading"
        @click="emit('click')"
      >
        <template #prepend>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3H4.5A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Z" />
            <path fill="#fff" d="M4.5 4.5h15v3h-15z" />
            <path fill="#EA4335" d="M4.5 4.5h15v1.875H4.5z" />
            <path fill="#fff" d="M6 9h12v10.5H6z" />
            <path fill="#4285F4" d="M10.5 14.25h3v1.5h-3z" />
            <path fill="#34A853" d="M13.5 11.25h1.5v4.5h-1.5z" />
            <path fill="#FBBC04" d="M9 12.75h1.5v3H9z" />
            <path fill="#EA4335" d="M9 11.25h3v1.5H9z" />
          </svg>
        </template>
        Agregar a Google Calendar
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
defineProps<{ loading?: boolean }>()

const emit = defineEmits<{ click: [] }>()
</script>
