<template>
  <v-sheet
    :color="event.color"
    class="text-white text-wrap pa-1 ma-0"
    width="100%"
  >
    <template v-if="!event.code">
      <v-icon start size="small">mdi-information</v-icon>
      <span class="font-weight-bold">
        {{ event.title }}
      </span>
    </template>
    <template v-else>
      <span>
        {{ event.code }}
        {{ event.section }}
        ({{ event.type }})
      </span>
      <br />
      {{ event.name }}
    </template>
  </v-sheet>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ScheduleEventInfo',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
})
</script>
<style lang="sass">

div.v-calendar-daily__day:nth-child(n) > div:nth-child(17)
  margin: 0
</style>
