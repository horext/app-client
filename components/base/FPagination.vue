<template>
  <v-row
    class="ma-2"
    align="center"
    justify="center"
  >
    <span class="grey--text">Items per page</span>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          text
          color="primary"
          class="ml-2"
          v-bind="attrs"
          v-on="on"
        >
          {{ syncItemsPerPage }}
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(number, index) in syncItemsPerPageArray"
          :key="index"
          @click="updateItemsPerPage(number)"
        >
          <v-list-item-title>{{ number }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />

    <span
      class="mr-2
              grey--text"
    >
      Page {{ syncPage }} of {{ syncTotalPages }}
    </span>
    <v-btn
      fab
      dark
      small
      color="blue darken-3"
      class="mr-1"
      @click="formerPage"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="blue darken-3"
      class="ml-1"
      @click="nextPage"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </v-row>
</template>
<script lang="ts">

import { Component, PropSync, Vue } from 'nuxt-property-decorator'
  @Component
export default class CreateUpdateCourse extends Vue {
    @PropSync('itemsPerPage')
    syncItemsPerPage!: any ;

    @PropSync('itemsPerPageArray')
    syncItemsPerPageArray!: any ;

    @PropSync('page')
    syncPage!: number ;

    @PropSync('totalPages')
    syncTotalPages!: number ;

    nextPage () {
      if (this.syncPage + 1 <= this.syncTotalPages) { this.syncPage += 1 }
    }

    formerPage () {
      if (this.syncPage - 1 >= 1) { this.syncPage -= 1 }
    }

    updateItemsPerPage (number: number) {
      this.syncItemsPerPage = number
    }
}
</script>
