<template>
  <v-container>
    <h1>Política de seguridad de Horext</h1>
    <div>Ultima revisión: 04 de marzo de 2022</div>
    <p>
      Horext es una aplicación web que permite a los usuarios generar horarios
      de clases de forma rápida y sencilla, nuestros usuarios confían en
      nosotros para mantener sus datos seguros, privados y disponibles siempre
      que los necesiten. Nos tomamos esa responsabilidad en serio. En Horext,
      mantenemos un sistema de seguridad que: Previene todo acceso no
      autorizado; Admite el monitoreo continuo de posibles vulnerabilidades; y
      Adopta mejoras continuas y proactivas para estar al tanto de las últimas
      amenazas y herramientas de seguridad.
    </p>
    <h2>Acceso a la cuenta</h2>
    <p class="text">
      Verificamos el acceso a la cuenta a través de la autenticación basada en
      la autenticación de cuentas de Google a través de OAuth 2.0.
      Alternativamente, OAuth proporciona una forma sencilla de crear y acceder
      a su cuenta sin que Horext necesite acceder o almacenar sus credenciales
      de inicio de sesión de Google.
    </p>
    <h2>Uso de los datos de los usuarios</h2>
    <p class="text">
      Los únicos datos del usuario recibidos son: nombre, correo electrónico y
      foto de perfil. Estos se guardarán y se volverán a mostrar al usuario. El
      correo electrónico se utilizará para identificar al usuario. El nombre y
      la imagen de perfil se utilizarán como el nombre y la imagen de perfil de
      su cuenta en la aplicación de Horext.
    </p>
    <h2>Divulgación de uso limitado de Google OAuth2</h2>
    <p>
      Esta aplicación solicita alcances restringidos, el uso de la información
      recibida de las API de Google por parte de la aplicación Horext cumplirá
      con la Política de datos de usuario de los servicios API de Google,
      incluidos los requisitos de uso limitado.
    </p>
    <h2>Privacidad de datos</h2>
    <p>
      Nuestra prioridad es ser transparentes en la forma en que recopilamos,
      usamos y manejamos su información cuando utiliza nuestro sitio web y
      nuestro software. Consulte nuestra
      <nuxt-link to="/privacy"> política de privacidad </nuxt-link>
      completa para obtener más detalles.
    </p>
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Política de Seguridad',
})
</script>
