<template>
  <v-sheet
    :color="event.color"
    class="white--text   text-wrap pa-1 ma-0 "
    style="max-width: inherit"
  >
    <template v-if="!event.code">
      <span class="font-weight-black">
        {{ event.title }}
      </span>
    </template>
    <template v-else>
      <span class="font-weight-black">
        {{ event.code }}
        {{ event.section }}
        ({{ event.typeSchedule }})
      </span>
      <br>
      {{ event.name }}
    </template>
    <br>
    <v-fade-transition>
      <v-overlay
        v-if="hover"
        z-index="0"
        absolute
        color="secondary"
      >
        <v-icon>mdi-information</v-icon>
      </v-overlay>
    </v-fade-transition>
  </v-sheet>
</template>
<script lang="ts">
export default {
  name: 'ScheduleEventInfo',
  props: {
    event: {},
    hover: {}
  }
}
</script>
<style lang="sass">

div.v-calendar-daily__day:nth-child(n) > div:nth-child(17)
  margin: 0
</style>
