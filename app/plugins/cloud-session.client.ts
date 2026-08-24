export default defineNuxtPlugin(async () => {
  const auth = useUserAuthStore()
  try {
    const session = await $fetch<{
      user: {
        id: string
        email?: string
        name?: string
        picture?: string
        isUniversityEmail?: boolean
      }
    }>('/api/v1/sessions/current')
    auth.setUser(session.user)
  } catch {
    // Local-only and signed-out users continue using IndexedDB normally.
  }
})
