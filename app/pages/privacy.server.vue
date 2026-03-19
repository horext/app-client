<template>
  <v-container>
    <h1>Política de privacidad de Horext</h1>
    <div>Ultima revisión: 08 de marzo de 2026</div>
    <br />

    <h2>Información que recopilamos</h2>
    <div class="text">
      Cuando inicias sesión con Google, recopilamos los siguientes datos
      proporcionados por tu cuenta de Google:
      <ul>
        <li>Nombre completo</li>
        <li>Dirección de correo electrónico</li>
        <li>Foto de perfil</li>
      </ul>
      Esta información se usa únicamente para identificarte dentro de la
      aplicación y personalizar tu experiencia. No recopilamos ni almacenamos
      contraseñas.
    </div>
    <br />

    <h2>Cómo usamos tu información</h2>
    <div class="text">
      Los datos recopilados se usan exclusivamente para:
      <ul>
        <li>Autenticar tu identidad al iniciar sesión.</li>
        <li>Mostrar tu nombre y foto de perfil dentro de la aplicación.</li>
        <li>
          Exportar tu horario generado a Google Calendar cuando lo solicites
          explícitamente.
        </li>
      </ul>
      No usamos tu información para publicidad, análisis de terceros, ni la
      vendemos a terceros.
    </div>
    <br />

    <h2>Acceso a Google Calendar</h2>
    <div class="text">
      Cuando usas la función de exportar a Google Calendar, Horext solicita
      acceso a tu cuenta de Google Calendar con los siguientes permisos:
      <ul>
        <li>
          <strong>calendar.app.created</strong>: Para crear un calendario
          secundario de Horext y agregar, modificar o eliminar eventos en él.
        </li>
        <li>
          <strong>calendar.calendarlist.readonly</strong>: Para consultar la
          lista de calendarios disponibles en tu cuenta.
        </li>
        <li>
          <strong>calendar.events</strong>: Para crear eventos en el calendario
          que selecciones, incluyendo tu calendario principal.
        </li>
      </ul>
      El uso de la información obtenida a través de las API de Google cumple con
      la
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy"
        target="_blank"
        >Política de datos de usuario de los servicios de API de Google</a
      >, incluyendo los requisitos de uso limitado. Horext accede a los datos de
      Google Calendar únicamente para realizar las acciones que el usuario
      solicita explícitamente y no almacena tokens de acceso de forma
      persistente.
    </div>
    <br />

    <h2>Análisis de uso (Google Analytics 4)</h2>
    <div class="text">
      Horext utiliza Google Analytics 4 (GA4) para recopilar datos anónimos
      sobre el uso de la aplicación, como páginas visitadas, tiempo de sesión y
      eventos de interacción. Esta información se usa exclusivamente para
      mejorar la experiencia del usuario y no se vincula a datos personales
      identificables.
      <br /><br />
      GA4 puede recopilar automáticamente datos como dirección IP (anonimizada),
      tipo de dispositivo y navegador. Esta aplicación opera bajo la legislación
      peruana de protección de datos (<strong>Ley N.° 29733</strong>) y no está
      sujeta al RGPD europeo. No se muestra un banner de cookies obligatorio,
      ya que la normativa aplicable no lo exige.
      <br /><br />
      Puedes optar por no participar en GA4 instalando el
      <a
        href="https://tools.google.com/dlpage/gaoptout"
        target="_blank"
        >complemento de inhabilitación de Google Analytics</a
      >.
    </div>
    <br />
    <div class="text">
      Los datos de sesión (nombre, correo, foto) se mantienen durante la sesión
      activa del usuario. No se almacenan en bases de datos externas de forma
      permanente. Los horarios generados se guardan localmente en el navegador
      del usuario (localStorage).
    </div>
    <br />

    <h2>Compartir información con terceros</h2>
    <div class="text">
      Horext no vende, alquila ni comparte tu información personal con terceros,
      excepto cuando es estrictamente necesario para proveer el servicio (por
      ejemplo, la comunicación con las API de Google Calendar).
    </div>
    <br />

    <h2>Tus derechos</h2>
    <div class="text">
      Puedes revocar el acceso de Horext a tu cuenta de Google en cualquier
      momento desde
      <a href="https://myaccount.google.com/permissions" target="_blank"
        >Permisos de tu cuenta de Google</a
      >. Al revocar el acceso, Horext dejará de tener acceso a tu información de
      Google.
    </div>
    <br />

    <h2>Servicios de terceros</h2>
    <div>
      Actualmente se integran los siguientes servicios de terceros:
      <ul>
        <li>
          <strong>Google Sign-In</strong>: Para autenticación de usuarios.
        </li>
        <li>
          <strong>Google Calendar API</strong>: Para exportar horarios
          generados.
        </li>
        <li>
          <strong>Google Analytics 4</strong>: Para análisis anónimo de uso de
          la aplicación.
        </li>
      </ul>
    </div>
    <br />

    <h2>Contacto</h2>
    <div>
      Si tienes preguntas sobre esta política de privacidad, puedes contactarnos
      en:
      <a href="https://github.com/horext/app-client/issues" target="_blank"
        >github.com/horext/app-client/issues</a
      >
    </div>
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Política de Privacidad',
})
</script>
