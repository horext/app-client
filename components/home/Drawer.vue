<template>
  <v-navigation-drawer
    bottom
    color="transparent"
    fixed
    height="auto"
    overlay-color="secondary"
    overlay-opacity=".8"
    temporary
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list
      :color="$vuetify.theme.dark?'grey darken-4':'grey lighten-5'"
      shaped
    >
      <v-list-item
        v-for="item in items"
        :key="item.route"
        :to="item.route"
        color="primary"
      >
        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

export default Vue.extend({
  name: 'HomeDrawer',

  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  }
})
</script>
