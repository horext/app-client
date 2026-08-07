<template>
  <LegalDocument
    title="Términos del servicio de Horext"
    updated-at="Ultima revisión: 08 de marzo de 2026"
  >
    <section>
      <h2>Descripción del servicio</h2>
      <p>
        Horext es una aplicación web gratuita que permite a estudiantes generar
        y organizar horarios de clases académicas. El servicio incluye la opción
        de exportar los horarios generados a Google Calendar.
      </p>
    </section>

    <section>
      <h2>Uso aceptable</h2>
      <div>
        <p>
          Al usar Horext, aceptas utilizarlo únicamente para fines legítimos y
          personales. No está permitido usar la aplicación para:
        </p>
        <ul>
          <li>Acceder a datos de terceros sin su consentimiento.</li>
          <li>Interferir con el funcionamiento de la aplicación.</li>
          <li>Usar la aplicación con fines comerciales no autorizados.</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Autenticación con Google</h2>
      <p>
        Horext usa Google Sign-In para autenticar usuarios. Al iniciar sesión,
        autorizas a Horext a recibir tu nombre, correo electrónico y foto de
        perfil desde tu cuenta de Google, exclusivamente para identificarte
        dentro de la aplicación.
      </p>
    </section>

    <section>
      <h2>Integración con Google Calendar</h2>
      <div>
        La exportación a Google Calendar es una función opcional que requiere tu
        autorización explícita. Al activarla, Horext solicita permisos para:
        <ul>
          <li>Consultar tu lista de calendarios.</li>
          <li>Crear eventos en el calendario que selecciones.</li>
          <li>Crear calendarios secundarios en tu nombre.</li>
        </ul>
        Puedes revocar este acceso en cualquier momento desde
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
          >myaccount.google.com/permissions</a
        >. El uso de los datos de Google Calendar por parte de Horext cumple con
        la
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
          >Política de datos de usuario de los servicios de API de Google</a
        >.
      </div>
    </section>

    <section>
      <h2>Servicios de terceros vinculados</h2>
      <p>
        Horext integra servicios de Google (Sign-In, Calendar API, Analytics).
        El uso de estos servicios está sujeto a los
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          >Términos de servicio de Google</a
        >. Horext no tiene responsabilidad por la disponibilidad o el contenido
        de dichos servicios.
      </p>
    </section>

    <section>
      <h2>Limitación de responsabilidad</h2>
      <p>
        Horext se proporciona "tal cual", sin garantías de ningún tipo. No nos
        hacemos responsables de pérdidas de datos, interrupciones del servicio
        ni daños derivados del uso de la aplicación.
      </p>
    </section>

    <section>
      <h2>Contacto</h2>
      <p>
        Para consultas sobre estos términos:
        <a
          href="https://github.com/horext/app-client/issues"
          target="_blank"
          rel="noopener noreferrer"
          >github.com/horext/app-client/issues</a
        >
      </p>
    </section>
  </LegalDocument>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Términos de servicio',
})
</script>
