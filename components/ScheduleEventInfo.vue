<template>
  <v-sheet
    :color="event.color"
    class="text-white text-wrap pl-2 pa-1 ma-0 border-1"
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
import { defineComponent } from 'vue'
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
<style lang="scss">
.border-1 {
  border-radius: 5px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid #e0e0e0;
}
</style>
