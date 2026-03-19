<template>
  <v-navigation-drawer v-model="internalDrawer" width="300">
    <v-card-title> Opciones </v-card-title>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        link
        exact
      >
        <template #prepend>
          <v-badge v-if="item.badge" color="blue" :content="item.badge">
            <v-icon>{{ item.icon }}</v-icon>
          </v-badge>

          <v-icon v-else>
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const props = defineProps<{
  drawer: boolean
  items: { title: string; icon: string; to: string; badge?: number }[]
}>()
const emit = defineEmits<{
  (eventName: 'update:drawer', value: boolean): void
}>()

const internalDrawer = useVModel(props, 'drawer', emit)
</script>
