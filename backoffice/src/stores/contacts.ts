import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export interface ContactRequest {
  id: string
  name: string
  email: string
  message: string
  is_read: number
  created_at: string
}

export const useContactsStore = defineStore('contacts', () => {
  const items = ref<ContactRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const unreadCount = computed(() => items.value.filter(i => !i.is_read).length)

  function getHeaders() {
    const auth = useAuthStore()
    return { ...auth.authHeaders() }
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE}/api/contacts`, { headers: getHeaders() })
      if (!res.ok) throw new Error('Failed to load contacts')
      items.value = await res.json() as ContactRequest[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function markRead(id: string) {
    await fetch(`${API_BASE}/api/contacts/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    })
    const item = items.value.find(i => i.id === id)
    if (item) item.is_read = 1
  }

  async function remove(id: string) {
    await fetch(`${API_BASE}/api/contacts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, loading, error, unreadCount, fetchAll, markRead, remove }
})
