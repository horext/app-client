export const createApiProxyTarget = (
  upstreamUrl: string,
  requestUrl: URL,
): string => {
  const upstream = upstreamUrl.replace(/\/+$/, '')
  if (!upstream) throw new Error('API upstream URL is not configured')

  const path = requestUrl.pathname.replace(/^\/api(?=\/|$)/, '')
  return `${upstream}${path}${requestUrl.search}`
}
