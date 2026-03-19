export function encodeBase64(value: string): string {
  if (import.meta.client) {
    return window.btoa(unescape(encodeURIComponent(value)))
  } else {
    return Buffer.from(value, 'ascii').toString('base64')
  }
}

export function decodeBase64(value: string): string {
  if (import.meta.client) {
    return decodeURIComponent(escape(window.atob(value)))
  } else {
    return Buffer.from(value, 'base64').toString('ascii')
  }
}
