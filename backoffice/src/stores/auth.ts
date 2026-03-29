import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('bo_token'))
  const router = useRouter()

  const isAuthenticated = computed(() => {
    if (!token.value) return false
    if (isTokenExpired(token.value)) {
      token.value = null
      localStorage.removeItem('bo_token')
      return false
    }
    return true
  })

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

  // Wrapper centralizzato: prepend API_BASE, aggiunge auth headers, redirige al login su 401
  async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' && input.startsWith('/')
      ? `${API_BASE}${input}`
      : input
    const headers = { ...authHeaders(), ...(init?.headers ?? {}) }
    const res = await fetch(url, { ...init, headers })
    if (res.status === 401) {
      logout()
      throw new Error('Session expired')
    }
    return res
  }

  return { token, isAuthenticated, login, logout, authHeaders, apiFetch }
})
