<template>
  <tr>
    <td class="text-left">
      {{ dayWeek }}
    </td>
    <td class="text-left">
      {{ timeInterval }}
    </td>
    <td class="text-left">
      {{ teacherFullName }}
    </td>
    <td class="text-left">
      {{ type }}
    </td>
    <td class="text-left">
      {{ classroom }}
    </td>
  </tr>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { weekdays } from '~/utils/core'

@Component
export default class ClassSessionItem extends Vue {
  @Prop({ type: Object }) session!: any

  get dayWeek () {
    return weekdays[this.session?.day].substring(0, 2).toUpperCase()
  }

  get type () {
    return this.session?.type?.code
  }

  get teacherFullName () {
    return this.session?.teacher?.fullName
  }

  get classroom () {
    return this.session?.classroom?.code
  }

  get timeInterval () {
    return this.session?.startTime.substring(0, 5) + ' - ' + this.session.endTime.substring(0, 5)
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@media #{map-get($display-breakpoints, 'sm-and-down')}

</style>
