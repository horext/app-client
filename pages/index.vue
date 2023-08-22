<template>
  <v-row no-gutters>
    <v-img
      :src="require('~/assets/material2.jpg')"
      gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
    >
      <v-container fill-height>
        <v-row align="center" class="white--text mx-auto" justify="center">
          <v-col class="white--text text-center" cols="12" tag="h1">
            <span
              :class="[
                $vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2',
              ]"
              class="font-weight-light"
            >
              Bienvenido a
            </span>
            <br />
            <span
              :class="[
                $vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4',
              ]"
              class="font-weight-black"
            >
              Horext
            </span>
          </v-col>

          <v-btn class="align-self-end" outlined dark to="/generator">
            <v-icon>mdi-chevron-double-right</v-icon>
            Generar mis horarios
          </v-btn>
        </v-row>
      </v-container>
    </v-img>
  </v-row>
</template>

<script>
export default {
  components: {},
}
</script>
<style></style>
