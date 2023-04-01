<template>
  <v-card :loading="$fetchState.pending">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                Sección
              </th>
              <th class="text-left">
                Día
              </th>
              <th class="text-left">
                Horas
              </th>
              <th class="text-left">
                Docente
              </th>
              <th class="text-left">
                Tipo
              </th>
              <th class="text-left">
                Aula
              </th>
            </tr>
          </thead>
          <ScheduleSubjectList
            v-model="selected"
            :schedules="schedules"
          />
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        text
        @click="$emit('cancel')"
      >
        Cancelar
      </v-btn>
      <v-btn color="primary" text @click="saveSections">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { useFetch } from '@nuxtjs/composition-api'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import ScheduleSubjectList from '~/components/subject/ScheduleItem.vue'
import { $api } from '~/utils/api'

export default defineComponent({
  components: { ScheduleSubjectList },
  props: {
    subject: { type: Object, required: true },
    hourlyLoad: { type: Object, required: true }
  },
  setup (props, { emit }) {
    const selected = ref<any[]>([])
    const schedulesSubject = ref<any[]>([])
    const sessions = ref<any[]>([])

    const fetchSchedules = async () => {
      if (props.subject?.id && props.hourlyLoad?.id) {
        const { data: schedulesSubjectData } = await $api.scheduleSubject.findBySubjectIdAndHourlyLoadId(
          props.subject.id, props.hourlyLoad.id
        )
        const ids = schedulesSubjectData.map((sb:any) => sb.schedule.id)
        const { data: sessionsData } = await $api.classSessions.findScheduleIds(ids)
        sessions.value = sessionsData
        schedulesSubject.value = schedulesSubjectData
      }
    }
    const { fetch } = useFetch(fetchSchedules)

    const schedules = computed(() => {
      return schedulesSubject.value.map(sb => ({
        ...sb?.schedule,
        scheduleSubject: {
          id: sb.id
        },
        sessions: sessions.value.filter(s => s.schedule.id === sb.schedule.id)
      }))
    })

    watch(() => props.subject, () => {
      fetch()
    })

    watch(schedules, () => {
      if (props.subject.schedules) {
        selected.value = schedules.value.filter((s1) => {
          const schedule = props.subject.schedules.find((s2: any) => s2.section.id === s1.section.id)
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
      title
    }
  }
})
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@media #{map-get($display-breakpoints, 'sm-and-down')}
  .v-data-table
    td, th
      padding: 0 10px

    td
      font-size: 0.75rem

</style>
