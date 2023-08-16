<template>
  <tr>
    <td :rowspan="sessionsCount+1">
      <v-checkbox
        v-model="valueSync"
        class="text-caption"
        dense
        :label="section"
        :value="schedule"
        multiple
      />
    </td>
  </tr>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'

export default defineComponent({
  props: {
    schedule: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    value: {
      type: [Array, Object],
      default: null
    }
  },
  emits: ['input'],
  setup (props, { emit }) {
    const valueSync = computed({
      get: () => props.value,
      set: (newValue) => {
        emit('input', newValue)
      }
    })

    const sessionsCount = computed(() => {
      return props.schedule?.sessions?.length
    })

    const section = computed(() => {
      return props.schedule?.section?.id
    })

    return { valueSync, sessionsCount, section }
  }
})
</script>
