export function readLsJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function readCookieJson<T>(name: string): T | null {
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
    if (!match) return null
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('='))) as T
  } catch {
    return null
  }
}
