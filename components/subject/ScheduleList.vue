<template>
  <v-card :loading="loading">
    <v-card-title>
      <span class="text-h5">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <ScheduleSubjectList
        v-model="selected"
        :schedules="schedules"
        :loading="loading"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" variant="text" @click="$emit('cancel')">
        Cancelar
      </v-btn>
      <v-btn color="primary" variant="text" @click="saveSections">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import ScheduleSubjectList from '~/components/subject/ScheduleItem.vue'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'

export default defineComponent({
  components: { ScheduleSubjectList },
  props: {
    subject: {
      type: Object as PropType<ISelectedSubject>,
      required: true,
    },
    schedules: {
      type: Array as PropType<ISubjectSchedule[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const { subject, schedules } = toRefs(props)

    const selected = ref<ISubjectSchedule[]>([])

    const availableSchedules = computed(() => {
      const currentSchedules = schedules.value
      const subjectSchedules = subject.value.schedules
      return currentSchedules.filter((s1) => {
        const schedule = subjectSchedules.find(
          (s2) => s2.section.id === s1.section.id,
        )
        return schedule?.id === s1?.id
      })
    })

    watch(availableSchedules, (availableSchedules) => {
      selected.value = availableSchedules.map((s) => ({ ...s }))
    })

    const saveSections = () => {
      emit('save', selected.value)
    }

    const title = computed(() => {
      const course = subject.value?.course
      return `${course?.id} - ${course?.name}`
    })
    return {
      selected,
      saveSections,
      title,
    }
  },
})
</script>
