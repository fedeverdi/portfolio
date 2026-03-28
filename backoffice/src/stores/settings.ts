import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export interface Settings {
  owner_name: string
  bio: string
  contact_email: string
  github_url: string
  linkedin_url: string
  site_status: 'published' | 'under_construction'
}

export const useSettingsStore = defineStore('settings', () => {
  const data = ref<Settings>({
    owner_name: '',
    bio: '',
    contact_email: '',
    github_url: '',
    linkedin_url: '',
    site_status: 'under_construction'
  })
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  function getHeaders() {
    const auth = useAuthStore()
    return { 'Content-Type': 'application/json', ...auth.authHeaders() }
  }

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      const res = await window.fetch(`${API_BASE}/api/settings`, { headers: getHeaders() })
      if (!res.ok) throw new Error('Failed to load settings')
      data.value = await res.json() as Settings
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function save(updates: Partial<Settings>): Promise<void> {
    saving.value = true
    error.value = null
    try {
      const res = await window.fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      Object.assign(data.value, updates)
    } finally {
      saving.value = false
    }
  }

  return { data, loading, saving, error, fetch, save }
})
