<template>
  <v-card>
    <v-toolbar flat theme="dark" :color="color">
      <slot name="top-items-right" />
      <v-spacer />
      <v-radio-group v-model="mode" hide-details density="compact" inline>
        <template #label>
          <div>Modo:</div>
        </template>
        <v-radio :value="MODES.CALENDAR" color="primary-darken-2">
          <template #label>
            <v-icon size="small" start> mdi-calendar </v-icon>Calendario
          </template>
        </v-radio>
        <v-radio :value="MODES.LIST" color="primary-darken-2">
          <template #label>
            <v-icon size="small" start> mdi-table </v-icon> Lista
          </template>
        </v-radio>
      </v-radio-group>
      <v-spacer />
      <slot name="top-items-left" :item="currentSchedule" />
    </v-toolbar>

    <div
      class="row col align-self-center align-items-center justify-center align-content-center ma-1"
    >
      <slot name="subtitle" :item="currentSchedule">
        <slot name="subtitle-items" :item="currentSchedule" />
        <template v-if="schedules.length > 0">
          <v-menu v-if="mode === MODES.CALENDAR" offset-y>
            <template #activator="{ props }">
              <v-btn
                color="purple"
                theme="dark"
                rounded
                variant="outlined"
                class="ma-1"
                v-bind="props"
              >
                <v-icon>mdi-export</v-icon>
                Exportar
              </v-btn>
            </template>
            <ScheduleExport
              v-model:dialog="dialogExport"
              :schedule="currentSchedule"
            />
          </v-menu>

          <v-btn
            color="indigo"
            theme="dark"
            rounded
            variant="outlined"
            class="ma-1"
            @click="dialogShare = !dialogShare"
          >
            <v-icon>mdi-share-variant</v-icon>
            Compartir
          </v-btn>
          <GoogleAuth
            v-if="currentSchedule"
            :events="currentSchedule.events"
            :end-date="endDate"
            :start-date="startDate"
          />
          <v-dialog v-model="dialogExport" max-width="600">
            <ScheduleExport
              v-model:dialog="dialogExport"
              :schedule="currentSchedule"
            />
          </v-dialog>
          <v-dialog v-model="dialogShare" max-width="600">
            <ScheduleShare
              v-model:dialog="dialogShare"
              :path="path"
              :schedule="currentSchedule"
            />
          </v-dialog>
        </template>
      </slot>
    </div>

    <v-divider />
    <v-card-text v-if="schedules.length > 0">
      <schedules-list
        ref="calendar"
        v-model:current-schedule="currentSchedule"
        :schedules="schedules"
        :week-days="weekDays"
        :mode="mode"
      />
    </v-card-text>
    <v-card-text v-else>
      <slot name="emptyBody">
        {{ emptyMessage }}
      </slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, ref, defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserConfigStore } from '~/stores/user-config'
import SchedulesList from '~/components/SchedulesList.vue'
import ScheduleShare from '~/components/ScheduleShare.vue'
import ScheduleExport from '~/components/ScheduleExport.vue'
import GoogleAuth from '~/components/GoogleAuth.vue'
import { ViewMode } from '~/model/ViewMode'
import { ISchedule } from '~/interfaces/schedule'

export default defineComponent({
  components: {
    SchedulesList,
    GoogleAuth,
    ScheduleShare,
    ScheduleExport,
  },
  props: {
    schedules: {
      type: Array as PropType<ISchedule[]>,
      default: () => [],
    },
    path: {
      type: String,
      default: '/subject',
    },
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
    emptyMessage: {
      type: String,
      default: '',
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useUserConfigStore()
    const { weekDays, hourlyLoad } = storeToRefs(store)
    const academicPeriodOrganizationUnit = computed(
      () => hourlyLoad.value?.academicPeriodOrganizationUnit!
    )

    const startDate = computed(
      () => academicPeriodOrganizationUnit.value?.fromDate
    )

    const endDate = computed(() => academicPeriodOrganizationUnit.value?.toDate)

    const currentSchedule = ref<ISchedule>()

    const dialogShare = ref(false)
    const dialogExport = ref(false)

    const message = ref('')

    const mode = ref(ViewMode.CALENDAR)

    const MODES = ref(ViewMode)

    return {
      weekDays,
      dialogShare,
      dialogExport,
      message,
      mode,
      startDate,
      endDate,
      MODES,
      currentSchedule,
    }
  },
})
</script>
