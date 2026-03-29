<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTextsStore } from '@/stores/texts'

const store = useTextsStore()
const successMsg = ref('')
const edited = ref<Record<string, string>>({})

onMounted(async () => {
  await store.fetchAll()
  for (const item of store.items) edited.value[item.key] = item.value
})

// Group by section prefix
const sections = computed(() => {
  const map: Record<string, typeof store.items> = {}
  for (const item of store.items) {
    const section = item.key.split('.')[0]
    if (!map[section]) map[section] = []
    map[section].push(item)
  }
  return map
})

const isDirty = computed(() =>
  store.items.some(i => edited.value[i.key] !== i.value)
)

async function save() {
  successMsg.value = ''
  const updates = store.items
    .filter(i => edited.value[i.key] !== i.value)
    .map(i => ({ key: i.key, value: edited.value[i.key] }))
  if (updates.length === 0) return
  await store.saveAll(updates)
  successMsg.value = `${updates.length} text${updates.length === 1 ? '' : 's'} saved.`
  setTimeout(() => { successMsg.value = '' }, 3000)
}

function reset() {
  for (const item of store.items) edited.value[item.key] = item.value
}

function sectionLabel(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}
</script>

<template>
  <div class="p-4 md:p-8 lg:p-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-primary" />
          <span class="text-[0.6875rem] font-bold tracking-[0.1em] text-secondary uppercase">Content</span>
        </div>
        <h2 class="text-3xl md:text-[3.5rem] font-bold tracking-tighter leading-tight text-on-surface">Texts</h2>
        <p class="text-on-surface-variant max-w-md mt-4 leading-relaxed text-sm">
          Edit the frontend content. Changes take effect immediately.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          :disabled="!isDirty || store.saving"
          class="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-xl font-medium text-sm hover:bg-surface-container-highest transition-colors disabled:opacity-40"
          @click="reset"
        >
          Reset
        </button>
        <button
          :disabled="!isDirty || store.saving"
          class="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm disabled:opacity-60 disabled:cursor-wait"
          @click="save"
        >
          <span class="material-symbols-outlined text-sm">save</span>
          {{ store.saving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="store.error" class="mb-6 px-4 py-3 bg-error/10 text-error text-sm rounded-xl border border-error/20">
      {{ store.error }}
    </div>
    <div v-if="successMsg" class="mb-6 px-4 py-3 bg-primary/10 text-primary text-sm rounded-xl border border-primary/20">
      {{ successMsg }}
    </div>

    <div v-if="store.loading" class="py-24 text-center text-on-surface-variant text-sm">Loading...</div>

    <div v-else class="space-y-8">
      <section
        v-for="(entries, section) in sections"
        :key="section"
        class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]"
      >
        <!-- Section header -->
        <div class="px-8 py-4 border-b border-surface-variant/20 flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary" />
          <h3 class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">
            {{ sectionLabel(section) }}
          </h3>
        </div>

        <!-- Entries -->
        <div class="divide-y divide-surface-variant/10">
          <div
            v-for="entry in entries"
            :key="entry.key"
            class="px-8 py-5 grid grid-cols-12 gap-6 items-start"
          >
            <div class="col-span-12 md:col-span-4">
              <p class="font-mono text-xs text-primary mb-1">{{ entry.key }}</p>
              <p class="text-[11px] text-on-surface-variant leading-relaxed">{{ entry.description }}</p>
            </div>
            <div class="col-span-12 md:col-span-8">
              <textarea
                v-if="entry.value.length > 80"
                v-model="edited[entry.key]"
                rows="3"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-2.5 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                :class="edited[entry.key] !== entry.value ? 'border-primary/40' : ''"
              />
              <input
                v-else
                v-model="edited[entry.key]"
                type="text"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-2.5 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                :class="edited[entry.key] !== entry.value ? 'border-primary/40' : ''"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
