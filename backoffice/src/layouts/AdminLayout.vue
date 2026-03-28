<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, RouterView } from 'vue-router'

const route = useRoute()
const auth = useAuthStore()

const navLinks = [
  { name: 'Dashboard', to: '/', icon: 'dashboard', match: '' },
  { name: 'Case Studies', to: '/case-studies', icon: 'work', match: 'case-studies' },
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
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full flex flex-col py-8 px-4 w-64 border-r border-surface-variant/30 bg-surface z-50">
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
    <header class="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant/30">
      <div class="flex items-center flex-1 max-w-xl">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            type="text"
            placeholder="Search entries, assets, or projects..."
            class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-1 focus:ring-outline-variant/20 focus:bg-surface-container-lowest transition-all"
          />
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-4">
          <button class="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button class="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full">
            <span class="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        <div class="h-8 w-px bg-surface-variant" />
        <div class="flex items-center gap-2">
          <span class="text-xs font-label uppercase tracking-widest text-on-surface-variant">Editing Mode</span>
          <div class="w-1 h-1 rounded-full bg-primary" />
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="ml-64 pt-16 min-h-screen">
      <RouterView />
    </main>
  </div>
</template>
