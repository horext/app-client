import Vue from 'vue'

export type VForm = Vue & { validate: () => boolean }

export {}
declare global {
  interface Window {
    gapi: any
  }
}
window.gapi = window.gapi || {}
