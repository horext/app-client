import { createApiProxyTarget } from '../../utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { apiUpstreamUrl } = useRuntimeConfig()

  try {
    const target = createApiProxyTarget(apiUpstreamUrl, getRequestURL(event))
    return await proxyRequest(event, target)
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage:
        error instanceof Error ? error.message : 'API proxy is unavailable',
    })
  }
})
