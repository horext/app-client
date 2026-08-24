/** Headers required by state-changing same-origin synchronization requests. */
export function syncMutationHeaders(
  headers: Record<string, string> = {},
): Record<string, string> {
  const token = csrfToken()
  return token ? { ...headers, 'x-csrf-token': token } : headers
}

function csrfToken(): string | undefined {
  if (typeof document === 'undefined') return
  const value = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('horext_csrf='))
    ?.slice('horext_csrf='.length)
  return value ? decodeURIComponent(value) : undefined
}
