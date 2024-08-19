<template>
  <v-card :loading="pending">
    <v-card-title>
      <span class="text-h5">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <ScheduleSubjectList
        v-model="selected"
        :schedules="schedules"
        :loading="pending"
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
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'
import {
  useClassSessionApi,
  useScheduleSubjectApi,
} from '~/modules/apis/runtime/composables'

export default defineComponent({
  components: { ScheduleSubjectList },
  props: {
    subject: {
      type: Object as PropType<ISelectedSubject>,
      required: true,
    },
    hourlyLoad: {
      type: Object as PropType<IHourlyLoad>,
      required: true,
    },
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const { subject, hourlyLoad } = toRefs(props)
    const scheduleSubjectApi = useScheduleSubjectApi()
    const classSessionsApi = useClassSessionApi()

    const selected = ref<ISubjectSchedule[]>([])
    const { data: schedules, pending } = useAsyncData<ISubjectSchedule[]>(
      async () => {
        const hourlyLoadId = hourlyLoad.value?.id
        const subjectId = subject.value?.id
        if (!hourlyLoadId || !subjectId) return []

        const schedulesSubject =
          await scheduleSubjectApi.findBySubjectIdAndHourlyLoadId(
            subjectId,
            hourlyLoadId,
          )
        const scheduleIds = schedulesSubject.map((sb) => sb.schedule.id)

        const sessions = await classSessionsApi.findScheduleIds(scheduleIds)

        return schedulesSubject.map((sb) => ({
          ...sb?.schedule,
          scheduleSubject: {
            id: sb.id,
          },
          sessions: sessions.filter((s) => s.schedule.id === sb.schedule.id),
          subject: subject.value,
        }))
      },
      {
        default: () => [],
        watch: [subject, hourlyLoad],
      },
    )

    watch(schedules, (schedules) => {
      const currentSchedules = subject.value.schedules
      if (currentSchedules) {
        selected.value = schedules.filter((s1) => {
          const schedule = currentSchedules.find(
            (s2) => s2.section.id === s1.section.id,
          )
          return schedule?.id === s1?.id
        })
      } else {
        selected.value = []
      }
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
      schedules,
      saveSections,
      title,
      pending,
    }
  },
})
</script>
