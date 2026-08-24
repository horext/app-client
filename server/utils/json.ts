export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function parseJsonValue(value: string): unknown {
  return JSON.parse(value)
}

export function parseJsonObject(value: string): Record<string, unknown> {
  const parsed = parseJsonValue(value)
  if (!isJsonObject(parsed)) throw new TypeError('Expected a JSON object.')
  return parsed
}
