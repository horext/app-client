<template>
  <v-navigation-drawer location="bottom" scrim="secondary" temporary>
    <v-list
      :color="
        $vuetify.theme.name === 'dark' ? 'grey darken-4' : 'grey lighten-5'
      "
      variant="outlined"
    >
      <v-list-item
        v-for="item in items"
        :key="item.route"
        :to="item.route"
        color="primary"
      >
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeDrawer',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
})
</script>
