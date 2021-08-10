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

import { Component, ModelSync, Prop, Vue } from 'nuxt-property-decorator'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import ScheduleSection from '~/components/subject/ScheduleSection.vue'

@Component({
  components: { ScheduleSection, ClassSessionItem }
})

export default class ScheduleSubjectList extends Vue {
  @Prop({ type: Array }) schedules!: Array<any>

  @ModelSync('value', 'input', { type: [Array, Object] }) valueSync!: any
}
</script>
