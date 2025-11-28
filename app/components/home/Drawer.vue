<template>
  <v-navigation-drawer
    location="bottom"
    scrim="secondary"
    temporary
    role="menu"
  >
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
        role="menuitem"
      >
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
defineProps<{ items: { name: string; route: string }[] }>()
</script>
