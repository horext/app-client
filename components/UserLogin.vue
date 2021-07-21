<template>
  <v-form
    ref="form"
  >
    <v-alert
      v-model="alert"
      type="error"
      dismissible
    >
      {{ errorMessage }}
    </v-alert>
    <v-text-field
      id="username"
      v-model="username"
      :rules="[rules.required]"
      label="Correo Electronico"
    />
    <v-text-field
      id="password"
      v-model="password"
      :rules="[rules.required]"
      label="Contraseña"
      type="password"
    />
    <v-btn block color="primary" @click="login">
      Iniciar Sesión
    </v-btn>
  </v-form>
</template>

<script>


export default {
  name: 'UserLogin',
  data: () => ({
    username: null,
    password: null,
    errorMessage: null,
    alert: null,
    errorCode: null,
    user: null,
    rules: {
      required: v => !!v || 'Este campo es requerido'
    }
  }),
  methods: {
    async login () {
      if (!this.$refs.form.validate()) {
        return
      }
      await this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>

</style>
