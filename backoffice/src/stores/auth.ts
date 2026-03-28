import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('bo_token'))
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const err = await res.json() as { error: string }
      throw new Error(err.error ?? 'Login failed')
    }

    const data = await res.json() as { token: string }
    token.value = data.token
    localStorage.setItem('bo_token', data.token)
    await router.push({ name: 'Dashboard' })
  }

  function logout() {
    token.value = null
    localStorage.removeItem('bo_token')
    router.push({ name: 'Login' })
  }

  function authHeaders(): Record<string, string> {
    return token.value
      ? { Authorization: `Bearer ${token.value}` }
      : {}
  }

  return { token, isAuthenticated, login, logout, authHeaders }
})
