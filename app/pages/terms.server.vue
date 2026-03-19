<template>
  <v-container>
    <h1>Términos del servicio de Horext</h1>
    <div>Ultima revisión: 08 de marzo de 2026</div>
    <br />

    <h2>Descripción del servicio</h2>
    <div class="text">
      Horext es una aplicación web gratuita que permite a estudiantes generar y
      organizar horarios de clases académicas. El servicio incluye la opción de
      exportar los horarios generados a Google Calendar.
    </div>
    <br />

    <h2>Uso aceptable</h2>
    <div class="text">
      Al usar Horext, aceptas utilizarlo únicamente para fines legítimos y
      personales. No está permitido usar la aplicación para:
      <ul>
        <li>Acceder a datos de terceros sin su consentimiento.</li>
        <li>Interferir con el funcionamiento de la aplicación.</li>
        <li>Usar la aplicación con fines comerciales no autorizados.</li>
      </ul>
    </div>
    <br />

    <h2>Autenticación con Google</h2>
    <div class="text">
      Horext usa Google Sign-In para autenticar usuarios. Al iniciar sesión,
      autorizas a Horext a recibir tu nombre, correo electrónico y foto de
      perfil desde tu cuenta de Google, exclusivamente para identificarte dentro
      de la aplicación.
    </div>
    <br />

    <h2>Integración con Google Calendar</h2>
    <div class="text">
      La exportación a Google Calendar es una función opcional que requiere tu
      autorización explícita. Al activarla, Horext solicita permisos para:
      <ul>
        <li>Consultar tu lista de calendarios.</li>
        <li>Crear eventos en el calendario que selecciones.</li>
        <li>Crear calendarios secundarios en tu nombre.</li>
      </ul>
      Puedes revocar este acceso en cualquier momento desde
      <a href="https://myaccount.google.com/permissions" target="_blank"
        >myaccount.google.com/permissions</a
      >. El uso de los datos de Google Calendar por parte de Horext cumple con
      la
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy"
        target="_blank"
        >Política de datos de usuario de los servicios de API de Google</a
      >.
    </div>
    <br />

    <h2>Servicios de terceros vinculados</h2>
    <div class="text">
      Horext integra servicios de Google (Sign-In, Calendar API, Analytics).
      El uso de estos servicios está sujeto a los
      <a href="https://policies.google.com/terms" target="_blank"
        >Términos de servicio de Google</a
      >. Horext no tiene responsabilidad por la disponibilidad o el contenido
      de dichos servicios.
    </div>
    <br />

    <h2>Limitación de responsabilidad</h2>
    <div class="text">
      Horext se proporciona "tal cual", sin garantías de ningún tipo. No nos
      hacemos responsables de pérdidas de datos, interrupciones del servicio ni
      daños derivados del uso de la aplicación.
    </div>
    <br />

    <h2>Contacto</h2>
    <div>
      Para consultas sobre estos términos:
      <a href="https://github.com/horext/app-client/issues" target="_blank"
        >github.com/horext/app-client/issues</a
      >
    </div>
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Términos de servicio',
})
</script>
