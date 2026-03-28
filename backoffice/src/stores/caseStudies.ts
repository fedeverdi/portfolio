import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export interface CaseStudy {
  id: string
  title: string
  client: string
  description: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  coverImage?: string
  content?: string
  createdAt: string
  updatedAt: string
}

export const useCaseStudiesStore = defineStore('caseStudies', () => {
  const items = ref<CaseStudy[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getHeaders() {
    const auth = useAuthStore()
    return { 'Content-Type': 'application/json', ...auth.authHeaders() }
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE}/api/case-studies`, { headers: getHeaders() })
      if (!res.ok) throw new Error('Failed to fetch')
      items.value = await res.json() as CaseStudy[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string): Promise<CaseStudy | null> {
    const res = await fetch(`${API_BASE}/api/case-studies/${id}`, { headers: getHeaders() })
    if (!res.ok) return null
    return res.json() as Promise<CaseStudy>
  }

  async function create(data: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseStudy> {
    const res = await fetch(`${API_BASE}/api/case-studies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create')
    const created = await res.json() as CaseStudy
    items.value.unshift(created)
    return created
  }

  async function update(id: string, data: Partial<CaseStudy>): Promise<CaseStudy> {
    const res = await fetch(`${API_BASE}/api/case-studies/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update')
    const updated = await res.json() as CaseStudy
    const idx = items.value.findIndex(c => c.id === id)
    if (idx !== -1) items.value[idx] = updated
    return updated
  }

  async function remove(id: string): Promise<void> {
    await fetch(`${API_BASE}/api/case-studies/${id}`, { method: 'DELETE', headers: getHeaders() })
    items.value = items.value.filter(c => c.id !== id)
  }

  const stats = () => ({
    total: items.value.length,
    published: items.value.filter(c => c.status === 'published').length,
    draft: items.value.filter(c => c.status === 'draft').length,
    archived: items.value.filter(c => c.status === 'archived').length
  })

  return { items, loading, error, fetchAll, fetchOne, create, update, remove, stats }
})
