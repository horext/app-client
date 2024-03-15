<template>
  <v-card
    class="abcRioButton"
    width="240"
    height="35"
    :color="$vuetify.theme.name === 'dark' ? 'white' : 'grey lighten-2'"
    @click="$emit('click')"
  >
    <v-row
      class="fill-height abcRioButtonContentWrapper"
      align-content="center"
      align="center"
      justify="center"
      no-gutters
    >
      <v-col cols="auto">
        <div class="abcRioButtonIcon pa-2">
          <div
            style="width: 18px; height: 18px"
            class="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18px"
              height="18px"
              viewBox="0 0 48 48"
              class="abcRioButtonSvg"
            >
              <g>
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
          </div>
        </div>
      </v-col>
      <v-col class="text-body-2 text--primary font-weight-bold">
        <slot />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'GoogleSignIn',
})
</script>

<style scoped>
.abcRioButton {
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition:
    background-color 0.218s,
    border-color 0.218s,
    box-shadow 0.218s;
  transition:
    background-color 0.218s,
    border-color 0.218s,
    box-shadow 0.218s;
  -webkit-user-select: none;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;
}

.abcRioButtonIcon {
  float: left;
}

.abcRioButton .abcRioButtonIcon {
  background-color: #fff;
  border-radius: 1px;
}

.abcRioButtonSvg {
  display: block;
}

.abcRioButton .abcRioButtonContentWrapper {
  border: 1px solid transparent;
}
</style>
