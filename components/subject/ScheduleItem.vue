<template>
  <tbody>
    <template
      v-for="schedule in schedules"
    >
      <ScheduleSection
        :key="schedule.id"
        v-model="valueSync"
        :schedule="schedule"
      />
      <ClassSessionItem
        v-for="session in schedule.sessions"
        :key="session.id"
        :session="session"
      />
    </template>
  </tbody>
</template>

<script lang="ts">
import { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent } from 'vue'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import ScheduleSection from '~/components/subject/ScheduleSection.vue'

export default defineComponent({
  components: { ScheduleSection, ClassSessionItem },
  props: {
    schedules: {
      type: Array as PropType<any[]>,
      required: true
    },
    value: {
      type: [Array, Object],
      required: true
    }
  },
  emits: ['input'],
  setup (props, { emit }) {
    const valueSync = computed({
      get () {
        return props.value
      },
      set (value) {
        emit('input', value)
      }
    })

    return {
      valueSync
    }
  }
})
</script>
