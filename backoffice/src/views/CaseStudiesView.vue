<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCaseStudiesStore } from '@/stores/caseStudies'

const store = useCaseStudiesStore()
const router = useRouter()
const search = ref('')

onMounted(() => store.fetchAll())

const filtered = computed(() => {
  if (!search.value) return store.items
  const q = search.value.toLowerCase()
  return store.items.filter(
    c => c.title.toLowerCase().includes(q) || c.client.toLowerCase().includes(q)
  )
})

async function deleteItem(id: string) {
  if (!confirm('Eliminare questo case study?')) return
  await store.remove(id)
}

const stats = computed(() => store.stats())
</script>

<template>
  <div class="p-12 max-w-7xl mx-auto">
    <!-- Page header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-primary" />
          <span class="text-[0.6875rem] font-bold tracking-[0.1em] text-secondary uppercase">Database Alpha</span>
        </div>
        <h2 class="text-[3.5rem] font-bold tracking-tighter leading-tight text-on-surface">Case Studies</h2>
        <p class="text-on-surface-variant max-w-md mt-4 leading-relaxed text-sm">
          Gestisci la documentazione tecnica e i case study del portfolio.
        </p>
      </div>
      <button
        class="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm"
        @click="router.push('/case-studies/new')"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Create New Case
      </button>
    </div>

    <!-- Stats mini bento -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div class="col-span-1 bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
        <p class="text-[0.6875rem] uppercase font-bold text-on-surface-variant tracking-wider">Total Active</p>
        <p class="text-3xl font-bold mt-1">{{ stats.total }}</p>
      </div>
      <div class="col-span-1 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <p class="text-[0.6875rem] uppercase font-bold text-on-surface-variant tracking-wider">Published</p>
        <p class="text-3xl font-bold mt-1">{{ stats.published }}</p>
      </div>
      <div class="col-span-1 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <p class="text-[0.6875rem] uppercase font-bold text-on-surface-variant tracking-wider">In Draft</p>
        <p class="text-3xl font-bold mt-1">{{ stats.draft }}</p>
      </div>
      <div class="col-span-1 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <p class="text-[0.6875rem] uppercase font-bold text-on-surface-variant tracking-wider">Archived</p>
        <p class="text-3xl font-bold mt-1">{{ stats.archived }}</p>
      </div>
    </div>

    <!-- Table -->
    <section class="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-16px_rgba(42,52,57,0.04)] overflow-hidden">
      <div class="px-8 py-5 border-b border-surface-variant/20 flex items-center justify-between gap-4">
        <div class="relative max-w-sm w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            v-model="search"
            type="text"
            placeholder="Search case studies..."
            class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div v-if="store.loading" class="px-8 py-16 text-center text-on-surface-variant text-sm">
        Loading...
      </div>
      <div v-else-if="filtered.length === 0" class="px-8 py-16 text-center text-on-surface-variant text-sm">
        No results found.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low">
              <th class="px-8 py-5 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Case Title</th>
              <th class="px-8 py-5 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Client</th>
              <th class="px-8 py-5 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Status</th>
              <th class="px-8 py-5 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Date</th>
              <th class="px-8 py-5 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/10">
            <tr
              v-for="item in filtered"
              :key="item.id"
              class="hover:bg-surface-container-low/30 transition-colors"
            >
              <td class="px-8 py-6">
                <span class="font-semibold text-on-surface text-sm">{{ item.title }}</span>
              </td>
              <td class="px-8 py-6 text-sm text-on-surface-variant">{{ item.client }}</td>
              <td class="px-8 py-6">
                <span
                  class="px-3 py-1 text-[0.6875rem] font-bold rounded-full uppercase tracking-wider"
                  :class="{
                    'bg-primary/10 text-primary': item.status === 'published',
                    'bg-surface-container-highest text-on-surface-variant': item.status === 'draft',
                    'bg-outline-variant/30 text-outline': item.status === 'archived'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-sm text-on-surface-variant">
                {{ new Date(item.createdAt).toLocaleDateString('it-IT') }}
              </td>
              <td class="px-8 py-6 text-right space-x-2">
                <RouterLink
                  :to="`/case-studies/${item.id}`"
                  class="p-2 text-secondary hover:bg-surface-container-high rounded-lg transition-colors inline-block"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                </RouterLink>
                <button
                  class="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  @click="deleteItem(item.id)"
                >
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-8 py-5 flex items-center justify-between bg-surface-container-low/50">
        <p class="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest">
          Showing {{ filtered.length }} of {{ store.items.length }} Cases
        </p>
      </div>
    </section>
  </div>
</template>
