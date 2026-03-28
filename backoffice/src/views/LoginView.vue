<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
  } catch (e) {
    errorMsg.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50">
    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[120px]" />
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[120px]" />
    </div>

    <main class="w-full max-w-md z-10">
      <!-- Brand header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span class="material-symbols-outlined text-primary text-3xl">terminal</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tighter text-slate-900">CaseStudio</h1>
        <p class="text-sm text-slate-500 mt-1">Admin Console</p>
      </div>

      <!-- Login card -->
      <div class="bg-surface-container-low p-10 rounded-2xl shadow-xl border border-slate-200">
        <form class="space-y-6" @submit.prevent="submit">
          <!-- Error -->
          <div v-if="errorMsg" class="px-4 py-3 bg-error/10 text-error text-sm rounded-xl border border-error/20">
            {{ errorMsg }}
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-600" for="email">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-slate-500 text-sm">alternate_email</span>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="admin@portfolio.dev"
                class="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-600" for="password">
                Security Key
              </label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-slate-500 text-sm">lock</span>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••••••"
                class="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
              />
            </div>
          </div>

          <!-- Remember -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 bg-white text-primary focus:ring-primary/50"
            />
            <label class="ml-2 block text-xs text-slate-600" for="remember-me">
              Remember terminal session
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center py-4 px-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-dim active:scale-[0.98] transition-all duration-150 shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-wait"
          >
            <span class="text-xs uppercase tracking-widest mr-2">
              {{ loading ? 'Authenticating...' : 'Authenticate' }}
            </span>
            <span class="material-symbols-outlined text-sm">login</span>
          </button>
        </form>

        <!-- Footer metadata -->
        <div class="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500" />
            <span class="text-[10px] font-mono text-slate-600 uppercase tracking-tight">System Online</span>
          </div>
          <div class="text-[10px] font-mono text-slate-600 uppercase tracking-tight">SEC_ZONE: 4-B</div>
        </div>
      </div>

      <!-- Bottom status -->
      <div class="mt-8 flex justify-center gap-8">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-slate-400 text-xs">security</span>
          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Encrypted</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-slate-400 text-xs">cloud_done</span>
          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Verified</span>
        </div>
      </div>
    </main>
  </div>
</template>
