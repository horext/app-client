<template>
  <v-speed-dial
    v-model="fab"
    bottom
    :class="{'mr-12':$vuetify.breakpoint.smAndUp}"
    class="mb-11"
    fixed
    right
    transition="slide-y-reverse-transition"
    direction="top"
  >
    <template v-slot:defa#defaultot />
    </template>
    <template #activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>
          {{ fab?'mdi-close':icon }}
        </v-icon>
      </v-btn>
    </template>
  </v-speed-dial>
</template>
<script lang="ts">

import { Vue } from 'nuxt-property-decorator'
export default Vue.extend({
  name: 'ScheduleOptionsFAB',
  props: {
    // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
    icon: {
    }
  },
  data: () => ({
    fab: false
  })
})
</script>
