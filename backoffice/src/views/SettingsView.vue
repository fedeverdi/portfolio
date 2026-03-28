<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const store = useSettingsStore()
const successMsg = ref('')

const form = ref({ ...store.data })

onMounted(async () => {
  await store.fetch()
  form.value = { ...store.data }
})

async function save() {
  successMsg.value = ''
  await store.save({ ...form.value })
  successMsg.value = 'Impostazioni salvate.'
  setTimeout(() => { successMsg.value = '' }, 3000)
}
</script>

<template>
  <div class="p-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-primary" />
          <span class="text-[0.6875rem] font-bold tracking-[0.1em] text-secondary uppercase">Configuration</span>
        </div>
        <h2 class="text-[3.5rem] font-bold tracking-tighter leading-tight text-on-surface">Settings</h2>
        <p class="text-on-surface-variant max-w-md mt-4 leading-relaxed text-sm">
          Gestisci le impostazioni globali del portfolio.
        </p>
      </div>
      <button
        :disabled="store.saving"
        class="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm disabled:opacity-60 disabled:cursor-wait"
        @click="save"
      >
        <span class="material-symbols-outlined text-sm">save</span>
        {{ store.saving ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>

    <!-- Feedback -->
    <div v-if="store.error" class="mb-6 px-4 py-3 bg-error/10 text-error text-sm rounded-xl border border-error/20">
      {{ store.error }}
    </div>
    <div v-if="successMsg" class="mb-6 px-4 py-3 bg-primary/10 text-primary text-sm rounded-xl border border-primary/20">
      {{ successMsg }}
    </div>

    <div v-if="store.loading" class="py-24 text-center text-on-surface-variant text-sm">Loading...</div>

    <div v-else class="grid grid-cols-12 gap-8">
      <!-- Owner info -->
      <section class="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-1.5 rounded-full bg-primary" />
          <h3 class="font-semibold text-lg text-on-surface">Informazioni Personali</h3>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Nome</label>
            <input
              v-model="form.owner_name"
              type="text"
              placeholder="Federico Verdi"
              class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Bio / Titolo</label>
            <input
              v-model="form.bio"
              type="text"
              placeholder="Senior Web Developer & Solutions Architect"
              class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email di contatto</label>
            <input
              v-model="form.contact_email"
              type="email"
              placeholder="email@esempio.com"
              class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      <!-- Site status -->
      <section class="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-1.5 rounded-full bg-tertiary" />
          <h3 class="font-semibold text-on-surface">Stato del Sito</h3>
        </div>
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Visibilità</label>
          <select
            v-model="form.site_status"
            class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="published">Pubblicato</option>
            <option value="under_construction">Under Construction</option>
          </select>
          <p class="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
            Se impostato su <strong>Under Construction</strong>, il frontend mostra la pagina di manutenzione.
          </p>
        </div>
      </section>

      <!-- Social links -->
      <section class="col-span-12 bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-1.5 rounded-full bg-secondary" />
          <h3 class="font-semibold text-lg text-on-surface">Social & Link</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">GitHub URL</label>
            <input
              v-model="form.github_url"
              type="url"
              placeholder="https://github.com/username"
              class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">LinkedIn URL</label>
            <input
              v-model="form.linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/username"
              class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
