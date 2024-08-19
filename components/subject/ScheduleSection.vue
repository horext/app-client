<template>
  <tr>
    <td :rowspan="sessionsCount + 1">
      <v-checkbox
        :id="section"
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
import { defineComponent, type PropType, computed } from 'vue'
import type { ISubjectSchedule } from '~/interfaces/subject'

export default defineComponent({
  props: {
    schedule: {
      type: Object as PropType<ISubjectSchedule>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<ISubjectSchedule[]>,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const valueSync = useVModel(props, 'modelValue', emit)
    const { schedule } = toRefs(props)

    const sessionsCount = computed(() => {
      return schedule.value?.sessions?.length
    })

    const section = computed(() => {
      return schedule.value?.section?.id
    })

    return { valueSync, sessionsCount, section }
  },
})
</script>
