<template>
  <v-row class="ma-2" align="center" justify="center">
    <span class="grey--text">Items per page</span>
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
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

    <span class="mr-2 grey--text">
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
    <v-btn fab dark small color="blue darken-3" class="ml-1" @click="nextPage">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </v-row>
</template>
<script lang="ts">
import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    itemsPerPage: {
      type: Number,
      required: true,
    },
    itemsPerPageArray: {
      type: Array,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'update:itemsPerPage',
    'update:page',
    'update:totalPages',
    'update:itemsPerPageArray',
  ],
  setup(props, { emit }) {
    const syncItemsPerPage = useVModel(props, 'itemsPerPage', emit)

    const syncItemsPerPageArray = useVModel(props, 'itemsPerPageArray', emit)

    const syncPage = useVModel(props, 'page', emit)

    const syncTotalPages = useVModel(props, 'totalPages', emit)

    const nextPage = () => {
      if (syncPage.value + 1 <= syncTotalPages.value) {
        syncPage.value += 1
      }
    }

    const formerPage = () => {
      if (syncPage.value - 1 >= 1) {
        syncPage.value -= 1
      }
    }

    const updateItemsPerPage = (number: number) => {
      syncItemsPerPage.value = number
    }

    return {
      syncItemsPerPage,
      syncItemsPerPageArray,
      syncPage,
      syncTotalPages,
      nextPage,
      formerPage,
      updateItemsPerPage,
    }
  },
})
</script>
