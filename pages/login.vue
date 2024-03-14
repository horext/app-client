<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-img>
            <div class="d-flex justify-center">
              <v-icon size="64">mdi-account</v-icon>
            </div>
          </v-img>
          <v-card-title class="text-center">
            <div class="headline font-weight-bold">Bienvenido a Horext</div>
          </v-card-title>
          <v-card-text class="text-center">
            Si no ha iniciado sesión previamente en Horext, se creará una nueva
            cuenta automáticamente.
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <div ref="googleButton"></div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoginPage',
})

useGoogleAccounts()

const {
  public: { gsi },
} = useRuntimeConfig()

const googleButton = ref<HTMLElement | null>(null)

onMounted(async () => {
  try {
    google.accounts.id.initialize({
      client_id: gsi.clientId,
      callback: handleCredentialResponse,
    })
    google.accounts.id.renderButton(googleButton.value!, {
      theme: 'filled_blue',
      size: 'large',
      type: 'standard',
    })
    google.accounts.id.prompt()
  } catch (error) {
    console.error('Error loading Google script', error)
  }
})

async function handleCredentialResponse(
  response: google.accounts.id.CredentialResponse,
) {
  await $fetch('/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: response,
  })
}
</script>
