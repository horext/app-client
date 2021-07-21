<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <generator-configuration-card :dialog.sync="dialog" />
  </v-dialog>
</template>

<script lang="ts">

import { Component, Vue } from 'nuxt-property-decorator'
import GeneratorConfigurationCard from '~/components/GeneratorConfigurationCard.vue'
@Component({
  components: { GeneratorConfigurationCard }
})
export default class GeneratorConfiguration extends Vue {
  dialog= false
}

</script>
