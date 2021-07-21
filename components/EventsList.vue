<template lang="html">
  <v-chip-group column>
    <v-chip
      v-for="course in events"
      :key="course.id"
      close
      color="primary lighten-1"
      @click:close="close(course)"
    >
      {{ course.name }} - {{ weekdays[course.day] }} {{ course.startTime }}-{{ course.endTime }}
    </v-chip>
    <slot name="lastItem">
      <v-chip @click="editEvents">
        Añadir
      </v-chip>
    </slot>
  </v-chip-group>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { weekdays } from '~/utils/core'
export default Vue.extend({
  name: 'EventsList',
  props: {
    editEvents: Function,
    events: Array
  },
  data: () => ({
    weekdays
  }),
  methods: {
    close (item: any) {
      this.$emit('delete', item)
    }
  }
})

</script>
