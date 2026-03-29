<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Mobile sidebar
const sidebarOpen = ref(false)
watch(() => route.path, () => { sidebarOpen.value = false })

// Cache purge
const purging = ref(false)
const purgeStatus = ref<'idle' | 'ok' | 'error'>('idle')
let purgeStatusTimer: ReturnType<typeof setTimeout>

async function purgeCache() {
  purging.value = true
  purgeStatus.value = 'idle'
  try {
    const res = await auth.apiFetch('/api/settings/purge', { method: 'POST' })
    purgeStatus.value = res.ok ? 'ok' : 'error'
  } catch {
    purgeStatus.value = 'error'
  } finally {
    purging.value = false
    clearTimeout(purgeStatusTimer)
    purgeStatusTimer = setTimeout(() => { purgeStatus.value = 'idle' }, 3000)
  }
}

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

interface SearchResults {
  caseStudies: { id: string; title: string; client: string; status: string }[]
}

const headerSearch = ref('')
const searchResults = ref<SearchResults>({ caseStudies: [] })
const searchOpen = ref(false)
const searchLoading = ref(false)
let debounceTimer: ReturnType<typeof setTimeout>

async function onHeaderSearch() {
  const q = headerSearch.value.trim()
  if (q.length < 2) {
    searchResults.value = { caseStudies: [] }
    searchOpen.value = false
    return
  }
  searchLoading.value = true
  searchOpen.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`, {
        headers: auth.authHeaders()
      })
      if (res.ok) searchResults.value = await res.json() as SearchResults
    } finally {
      searchLoading.value = false
    }
  }, 250)
}

function closeSearch() {
  setTimeout(() => { searchOpen.value = false }, 150)
}

function goToResult(path: string) {
  searchOpen.value = false
  headerSearch.value = ''
  router.push(path)
}

const totalResults = () => searchResults.value.caseStudies.length

const navLinks = [
  { name: 'Dashboard', to: '/', icon: 'dashboard', match: '' },
  { name: 'Case Studies', to: '/case-studies', icon: 'work', match: 'case-studies' },
  { name: 'Contacts', to: '/contacts', icon: 'inbox', match: 'contacts' },
  { name: 'Texts', to: '/texts', icon: 'edit_note', match: 'texts' },
  { name: 'Settings', to: '/settings', icon: 'settings', match: 'settings' }
]

function isActive(link: { match: string }) {
  if (link.match === '') return route.path === '/'
  return route.path.startsWith('/' + link.match)
}

function logout() {
  auth.logout()
}
</script>

<template>
  <div class="bg-background text-on-surface min-h-screen custom-scrollbar">

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-full flex flex-col py-8 px-4 w-64 border-r border-surface-variant/30 bg-surface z-50 transition-transform duration-300"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="mb-12 px-4">
        <h1 class="text-xl font-bold tracking-tighter text-primary">CaseStudio</h1>
        <p class="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mt-1">Technical Editorial Admin</p>
      </div>

      <nav class="flex-1 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm tracking-tight transition-colors duration-200 font-medium"
          :class="isActive(link)
            ? 'text-primary font-semibold border-r-2 border-primary bg-surface-container-low'
            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'"
        >
          <span class="material-symbols-outlined">{{ link.icon }}</span>
          {{ link.name }}
        </RouterLink>
      </nav>

      <!-- User profile + logout -->
      <div class="mt-auto px-4 pt-8 border-t border-surface-variant/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-on-surface">Admin User</p>
            <p class="text-[0.6875rem] text-on-surface-variant">Editorial Lead</p>
          </div>
        </div>
        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 text-on-surface-variant hover:text-error transition-colors text-sm font-medium"
          @click="logout"
        >
          <span class="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Top header -->
    <header class="fixed top-0 right-0 left-0 lg:left-64 h-16 flex justify-between items-center px-4 lg:px-8 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant/30">
      <!-- Hamburger (mobile only) -->
      <button
        class="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors mr-3 shrink-0"
        @click="sidebarOpen = !sidebarOpen"
      >
        <span class="material-symbols-outlined">{{ sidebarOpen ? 'close' : 'menu' }}</span>
      </button>

      <!-- Search -->
      <div class="flex items-center flex-1 max-w-xl">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            v-model="headerSearch"
            type="text"
            placeholder="Search case studies..."
            class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-1 focus:ring-outline-variant/20 focus:bg-surface-container-lowest transition-all"
            @input="onHeaderSearch"
            @blur="closeSearch"
          />
          <!-- Dropdown results -->
          <div
            v-if="searchOpen"
            class="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-surface-variant/30 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div v-if="searchLoading" class="px-4 py-6 text-center text-on-surface-variant text-xs">
              <span class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            </div>
            <div v-else-if="totalResults() === 0" class="px-4 py-6 text-center text-on-surface-variant text-xs">
              Nessun risultato per "<span class="text-on-surface font-medium">{{ headerSearch }}</span>"
            </div>
            <div v-else>
              <div class="px-4 py-2 border-b border-surface-variant/20">
                <span class="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Case Studies</span>
              </div>
              <button
                v-for="item in searchResults.caseStudies"
                :key="item.id"
                class="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
                @mousedown="goToResult(`/case-studies/${item.id}`)"
              >
                <span class="material-symbols-outlined text-on-surface-variant text-sm">work</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-on-surface truncate">{{ item.title }}</p>
                  <p class="text-[11px] text-on-surface-variant">{{ item.client }}</p>
                </div>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
                  :class="{
                    'bg-primary/10 text-primary': item.status === 'published',
                    'bg-surface-container-highest text-on-surface-variant': item.status === 'draft',
                    'bg-outline-variant/30 text-outline': item.status === 'archived'
                  }"
                >{{ item.status }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 lg:gap-6 ml-3">
        <!-- Purge cache -->
        <button
          class="flex items-center gap-1.5 text-xs font-medium px-2 lg:px-3 py-1.5 rounded-lg transition-all"
          :class="{
            'text-on-surface-variant hover:text-primary hover:bg-surface-container-high': purgeStatus === 'idle',
            'text-success bg-success/10': purgeStatus === 'ok',
            'text-error bg-error/10': purgeStatus === 'error',
            'opacity-50 cursor-not-allowed': purging
          }"
          :disabled="purging"
          :title="purgeStatus === 'ok' ? 'Cache purged!' : purgeStatus === 'error' ? 'Purge failed' : 'Purge cache'"
          @click="purgeCache"
        >
          <span
            class="material-symbols-outlined text-sm"
            :class="{ 'animate-spin': purging }"
          >
            {{ purging ? 'progress_activity' : purgeStatus === 'ok' ? 'check_circle' : purgeStatus === 'error' ? 'error' : 'delete_sweep' }}
          </span>
          <span class="hidden lg:inline">
            {{ purging ? 'Purging...' : purgeStatus === 'ok' ? 'Purged!' : purgeStatus === 'error' ? 'Failed' : 'Purge Cache' }}
          </span>
        </button>

        <div class="hidden lg:flex items-center gap-2">
          <button class="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button class="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full">
            <span class="material-symbols-outlined">help_outline</span>
          </button>
        </div>

        <div class="hidden lg:block h-8 w-px bg-surface-variant" />
        <div class="hidden lg:flex items-center gap-2">
          <span class="text-xs font-label uppercase tracking-widest text-on-surface-variant">Editing Mode</span>
          <div class="w-1 h-1 rounded-full bg-primary" />
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="ml-0 lg:ml-64 pt-16 min-h-screen">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
