<template>
  <img
    class="VuetifyLogo"
    alt="Vuetify Logo"
    src="/horext-logo.svg"
  >
</template>

<style>
.VuetifyLogo {
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
