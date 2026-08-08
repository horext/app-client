import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface AuthUser {
  id: string
  email?: string
  name?: string
  picture?: string
  isUniversityEmail?: boolean
}

const AUTH_USER_STORAGE_KEY = 'horext-auth-user'

function loadStoredUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(AUTH_USER_STORAGE_KEY) ?? 'null',
    )
    if (!value || typeof value !== 'object' || !('id' in value)) return null
    return typeof value.id === 'string' ? (value as AuthUser) : null
  } catch {
    return null
  }
}

export const useUserAuthStore = defineStore('user-auth', () => {
  const user = ref<AuthUser | null>(loadStoredUser())

  const isLoggedIn = computed(() => !!user.value)

  function setUser(data: AuthUser) {
    user.value = data
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data))
  }

  function clearUser() {
    user.value = null
    if (typeof localStorage !== 'undefined')
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  }

  return { user, isLoggedIn, setUser, clearUser }
})
