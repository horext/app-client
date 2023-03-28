<template>
  <tr>
    <td :rowspan="sessionsCount + 1">
      {{ courseName }}
    </td>
    <td :rowspan="sessionsCount + 1">
      {{ subjectSection }}
    </td>
  </tr>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component
export default class ScheduleSection extends Vue {
  @Prop({ type: Object, default: () => ({}) }) readonly schedule!: any

  get sessionsCount () {
    return this.schedule?.sessions?.length
  }

  get courseName () {
    return (
      this.schedule?.subject?.course.name
    )
  }

  get subjectSection () {
    return (
      this.schedule?.subject?.course.id + ' ' + this.schedule?.section?.id
    )
  }
}
</script>
