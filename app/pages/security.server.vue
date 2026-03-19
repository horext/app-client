<template>
  <v-container>
    <h1>Política de seguridad de Horext</h1>
    <div>Ultima revisión: 08 de marzo de 2026</div>
    <p>
      Horext es una aplicación web que permite a los usuarios generar horarios
      de clases de forma rápida y sencilla. Nuestros usuarios confían en
      nosotros para mantener sus datos seguros, privados y disponibles siempre
      que los necesiten.
    </p>

    <h2>Acceso a la cuenta</h2>
    <p class="text">
      Verificamos el acceso a la cuenta a través de Google Sign-In (OpenID
      Connect). Horext no almacena ni tiene acceso a tus credenciales de Google.
      La autenticación es gestionada directamente por Google.
    </p>

    <h2>Permisos de Google solicitados</h2>
    <p class="text">
      Para la función de exportar horarios a Google Calendar, Horext solicita
      los siguientes permisos sensibles (no restringidos):
    </p>
    <ul>
      <li>
        <strong>calendar.app.created</strong>: Crear y administrar calendarios
        secundarios creados por Horext.
      </li>
      <li>
        <strong>calendar.calendarlist.readonly</strong>: Consultar la lista de
        calendarios del usuario.
      </li>
      <li>
        <strong>calendar.events</strong>: Crear eventos en el calendario que el
        usuario seleccione.
      </li>
    </ul>
    <p>
      El uso de estos permisos cumple con la
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy"
        target="_blank"
        >Política de datos de usuario de los servicios de API de Google</a
      >, incluyendo los requisitos de uso limitado. Los tokens de acceso no se
      almacenan de forma persistente en servidores de Horext.
    </p>

    <h2>Uso de los datos de los usuarios</h2>
    <p class="text">
      Los únicos datos personales recibidos son: nombre, correo electrónico y
      foto de perfil, obtenidos a través de Google Sign-In. Estos se usan
      únicamente para identificar al usuario dentro de la sesión activa.
    </p>

    <h2>Privacidad de datos</h2>
    <p>
      Consulte nuestra
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
