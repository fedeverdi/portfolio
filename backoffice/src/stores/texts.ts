import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export interface TextEntry {
  key: string
  value: string
  description: string
  updated_at: string
}

export const useTextsStore = defineStore('texts', () => {
  const items = ref<TextEntry[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  function getHeaders() {
    const auth = useAuthStore()
    return { 'Content-Type': 'application/json', ...auth.authHeaders() }
  }

  function apiFetch(input: RequestInfo, init?: RequestInit) {
    const auth = useAuthStore()
    return auth.apiFetch(input, init)
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch(`${API_BASE}/api/texts`, { headers: getHeaders() })
      if (!res.ok) throw new Error('Failed to load texts')
      items.value = await res.json() as TextEntry[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function saveAll(updates: { key: string; value: string }[]): Promise<void> {
    saving.value = true
    error.value = null
    try {
      const res = await apiFetch(`${API_BASE}/api/texts`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      })
      if (!res.ok) throw new Error('Failed to save texts')
      const now = new Date().toISOString()
      for (const u of updates) {
        const item = items.value.find(i => i.key === u.key)
        if (item) { item.value = u.value; item.updated_at = now }
      }
    } finally {
      saving.value = false
    }
  }

  return { items, loading, saving, error, fetchAll, saveAll }
})
