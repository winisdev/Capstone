import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.api'

const AUTH_USER_STORAGE_KEY = 'blis.auth.user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeStoredUser(user) {
  if (user) {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
    return
  }
  localStorage.removeItem(AUTH_USER_STORAGE_KEY)
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(readStoredUser())
  // Require explicit login on each fresh app load (no silent session restore).
  const initialized = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  // ─── actions ─────────────────────────────────────────────────────────────────
  async function login(email, password) {
    const { data } = await authApi.login({ email, password })
    user.value = data.user
    writeStoredUser(user.value)
    initialized.value = true
  }

  async function register(name, student_id, email, password, password_confirmation) {
    const { data } = await authApi.register({
      name, student_id, email, password, password_confirmation,
    })
    user.value = data.user
    writeStoredUser(user.value)
    initialized.value = true
  }

  async function fetchMe(options = {}) {
    const { silent = false } = options

    try {
      const { data } = await authApi.me()
      user.value = data
      writeStoredUser(user.value)
      return data
    } catch (error) {
      user.value = null
      writeStoredUser(null)
      if (!silent && error?.response?.status !== 401) {
        throw error
      }
      return null
    } finally {
      initialized.value = true
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      writeStoredUser(null)
      initialized.value = true
    }
  }

  return {
    user,
    initialized,
    isAuthenticated,
    login,
    register,
    fetchMe,
    logout,
  }
})
