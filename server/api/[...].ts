export default defineEventHandler((event) => {
  const { apiUrl: target } = useRuntimeConfig()
  const apiPath = event.path.replace('/api', '')
  const targetPath = target + apiPath
  return proxyRequest(event, targetPath)
})
