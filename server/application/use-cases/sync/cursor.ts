export function encodeCursor(value: number): string {
  return btoa(String(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeCursor(value?: string): number {
  if (value === undefined) return 0
  const cursor = Number(
    new TextDecoder().decode(
      Uint8Array.from(
        atob(value.replace(/-/g, '+').replace(/_/g, '/')),
        (character) => character.charCodeAt(0),
      ),
    ),
  )
  if (!Number.isSafeInteger(cursor) || cursor < 0)
    throw new Error('Invalid cursor.')
  return cursor
}
