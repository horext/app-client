<template>
  <tr>
    <td :rowspan="sessionsCount + 1">
      <v-checkbox
        v-model="valueSync"
        class="text-caption"
        density="compact"
        :label="section"
        :value="schedule"
        multiple
      />
    </td>
  </tr>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ISubjectSchedule } from '~/interfaces/subject'

export default defineComponent({
  props: {
    schedule: {
      type: Object as PropType<ISubjectSchedule>,
      required: true,
    },
    value: {
      type: Array as PropType<ISubjectSchedule[]>,
      default: null,
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const valueSync = computed({
      get: () => props.value,
      set: (newValue) => {
        emit('input', newValue)
      },
    })

    const sessionsCount = computed(() => {
      return props.schedule?.sessions?.length
    })

    const section = computed(() => {
      return props.schedule?.section?.id
    })

    return { valueSync, sessionsCount, section }
  },
})
</script>
