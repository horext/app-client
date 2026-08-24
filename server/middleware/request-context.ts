export default defineEventHandler((event) => {
  const requestId = getHeader(event, 'x-request-id') || crypto.randomUUID()
  event.context.requestId = requestId
  setResponseHeader(event, 'x-request-id', requestId)
})
