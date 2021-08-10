<template>
  <tr>
    <td :rowspan="sessionsCount+1">
      <v-checkbox
        v-model="valueSync"
        class="text-caption"
        dense
        :label="section"
        :value="schedule"
        multiple
      />
    </td>
  </tr>
</template>
<script lang="ts">
import { Component, ModelSync, Prop, Vue } from 'nuxt-property-decorator'
@Component
export default class ScheduleSection extends Vue {
  @Prop({ type: Object, default: () => ({}) }) readonly schedule!: any

  @ModelSync('value', 'input', { type: [Array, Object] }) valueSync!: any

  get sessionsCount () {
    return this.schedule?.sessions?.length
  }

  get section () {
    return this.schedule?.section?.id
  }
}
</script>
