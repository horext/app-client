<template>
  <v-container fluid class="pt-0 pb-0">
    <v-row>
      <v-col>
        <v-row align="center" justify="center">
          <v-dialog
            v-model="shareDialog"
            :close-on-content-click="false"
            :max-width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                Exportar
              </v-btn>
            </template>

            <v-card/>
          </v-dialog>
        </v-row>
      </v-col>
      <v-col>
        <v-row align="center" justify="center">
          <v-btn outlined>
            Compartir
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="js">
export default {
  name: 'ScheduleOptionsBar',
  props: {
    shareDialog: {}
  }
}
</script>
