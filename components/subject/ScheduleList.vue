<template>
  <v-card :loading="pending">
    <v-card-title>
      <span class="text-h5">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-table dense>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">Sección</th>
              <th class="text-left">Día</th>
              <th class="text-left">Horas</th>
              <th class="text-left">Docente</th>
              <th class="text-left">Tipo</th>
              <th class="text-left">Aula</th>
            </tr>
          </thead>
          <ScheduleSubjectList
            v-model="selected"
            :schedules="schedules"
            :loading="pending"
          />
        </template>
      </v-table>
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
import { useApi } from '~/composables/api'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IScheduleSubject } from '~/interfaces/schedule-subject'
import type {
  ISelectedSubject,
  ISession,
  ISubjectSchedule,
} from '~/interfaces/subject'

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
    const $api = useApi()
    const selected = ref<ISubjectSchedule[]>([])
    const { data: schedulesSubject, pending: pendingSchedulesSubject } =
      useAsyncData<IScheduleSubject[]>(
        async () => {
          const hourlyLoadId = hourlyLoad.value?.id
          const subjectId = subject.value?.id
          if (!hourlyLoadId || !subjectId) return []

          return $api.scheduleSubject.findBySubjectIdAndHourlyLoadId(
            subjectId,
            hourlyLoadId,
          )
        },
        {
          default: () => [],
          watch: [subject, hourlyLoad],
        },
      )
    const scheduleIds = computed(() => {
      return schedulesSubject.value.map((sb) => sb.schedule.id)
    })

    const { data: sessions, pending: pendingSessions } = useAsyncData<
      ISession[]
    >(
      async () => {
        const ids = scheduleIds.value
        const sessionsData = await $api.classSessions.findScheduleIds(ids)
        return sessionsData
      },
      {
        default: () => [],
        watch: [scheduleIds],
      },
    )

    const schedules = computed<ISubjectSchedule[]>(() => {
      return schedulesSubject.value.map((sb) => ({
        ...sb?.schedule,
        scheduleSubject: {
          id: sb.id,
        },
        sessions: sessions.value.filter(
          (s) => s.schedule.id === sb.schedule.id,
        ),
        subject: subject.value,
      }))
    })

    watch(schedules, () => {
      if (props.subject.schedules) {
        selected.value = schedules.value.filter((s1) => {
          const schedule = props.subject.schedules.find(
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

    const pending = computed(() => {
      return pendingSchedulesSubject.value || pendingSessions.value
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
