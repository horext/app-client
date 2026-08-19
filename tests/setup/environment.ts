import { Window } from 'happy-dom'

// Node 25 exposes an incomplete localStorage unless --localstorage-file is
// configured. Give Nuxt tests an isolated browser-compatible implementation.
const testWindow = new Window({ url: 'http://localhost' })

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: testWindow.localStorage,
})
