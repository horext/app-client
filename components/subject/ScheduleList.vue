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
          <ScheduleSubjectList v-model="selected" :schedules="schedules" />
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
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
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
  setup(props, { emit }) {
    const $api = useApi()
    const selected = ref<ISubjectSchedule[]>([])
    const schedulesSubject = ref<IScheduleSubject[]>([])
    const sessions = ref<ISession[]>([])

    const fetchSchedules = async () => {
      if (props.subject?.id && props.hourlyLoad?.id) {
        const schedulesSubjectData =
          await $api.scheduleSubject.findBySubjectIdAndHourlyLoadId(
            props.subject.id,
            props.hourlyLoad.id,
          )
        const ids = schedulesSubjectData.map((sb) => sb.schedule.id)
        const sessionsData = await $api.classSessions.findScheduleIds(ids)
        sessions.value = sessionsData
        schedulesSubject.value = schedulesSubjectData
      }
    }
    const { refresh, pending } = useAsyncData(fetchSchedules)

    const schedules = computed<ISubjectSchedule[]>(() => {
      return schedulesSubject.value.map((sb) => ({
        ...sb?.schedule,
        scheduleSubject: {
          id: sb.id,
        },
        sessions: sessions.value.filter(
          (s) => s.schedule.id === sb.schedule.id,
        ),
        subject: props.subject,
      }))
    })

    watch(
      () => props.subject,
      () => {
        refresh()
      },
    )

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
      return `${props.subject?.course?.id} - ${props.subject?.course?.name}`
    })

    onMounted(() => {
      fetchSchedules()
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
