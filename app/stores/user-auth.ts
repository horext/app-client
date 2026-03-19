import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface AuthUser {
  email?: string
  name?: string
  picture?: string
  isUniversityEmail?: boolean
}

export const useUserAuthStore = defineStore('user-auth', () => {
  const user = ref<AuthUser | null>(null)

  const isLoggedIn = computed(() => !!user.value)

  function setUser(data: AuthUser) {
    user.value = data
  }

  function clearUser() {
    user.value = null
  }

  return { user, isLoggedIn, setUser, clearUser }
})
