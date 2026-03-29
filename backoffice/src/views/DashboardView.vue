<script setup lang="ts">
import { onMounted } from 'vue'
import { useCaseStudiesStore } from '@/stores/caseStudies'
import { useRouter } from 'vue-router'

const store = useCaseStudiesStore()
const router = useRouter()

onMounted(() => store.fetchAll())

const statCards = () => {
  const s = store.stats()
  return [
    { label: 'Total Active', value: s.total, icon: 'work', trend: null },
    { label: 'Published', value: s.published, icon: 'publish', trend: null },
    { label: 'In Draft', value: s.draft, icon: 'edit_note', trend: null },
    { label: 'Archived', value: s.archived, icon: 'archive', trend: null }
  ]
}
</script>

<template>
  <div class="p-4 md:p-8 lg:p-12">
    <!-- Page header -->
    <div class="flex flex-col md:flex-row md:items-end gap-4 justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-on-surface">System Overview</h2>
        <p class="text-on-surface-variant text-sm mt-1">Real-time case study metrics and status.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 bg-surface-container-lowest border border-surface-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low rounded-xl transition-all flex items-center gap-2"
          @click="store.fetchAll()"
        >
          <span class="material-symbols-outlined text-sm">refresh</span>
          Refresh
        </button>
        <button
          class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim rounded-xl transition-all flex items-center gap-2"
          @click="router.push('/case-studies/new')"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          New Case Study
        </button>
      </div>
    </div>

    <!-- Stats bento grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <div
        v-for="(card, i) in statCards()"
        :key="card.label"
        class="bg-surface-container-lowest p-5 border border-surface-variant/30 rounded-xl shadow-sm"
        :class="i === 0 ? 'border-l-4 border-l-primary' : ''"
      >
        <div class="flex justify-between items-start mb-4">
          <span class="text-on-surface-variant text-xs font-medium uppercase tracking-wider">{{ card.label }}</span>
          <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ card.icon }}</span>
        </div>
        <div class="text-3xl font-bold text-on-surface">
          <span v-if="store.loading">—</span>
          <span v-else>{{ card.value }}</span>
        </div>
      </div>
    </div>

    <!-- Recent case studies table -->
    <div class="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-16px_rgba(42,52,57,0.04)] overflow-hidden">
      <div class="px-8 py-5 border-b border-surface-variant/20 flex justify-between items-center">
        <h3 class="text-sm font-bold text-on-surface">Recent Case Studies</h3>
        <RouterLink
          to="/case-studies"
          class="text-[10px] uppercase font-bold text-primary hover:underline tracking-widest"
        >
          View All
        </RouterLink>
      </div>

      <div v-if="store.loading" class="px-8 py-12 text-center text-on-surface-variant text-sm">
        Loading...
      </div>
      <div v-else-if="store.items.length === 0" class="px-8 py-12 text-center text-on-surface-variant text-sm">
        No case studies yet.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low">
              <th class="px-8 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Title</th>
              <th class="px-8 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Client</th>
              <th class="px-8 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20">Status</th>
              <th class="px-8 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/10">
            <tr
              v-for="item in store.items.slice(0, 5)"
              :key="item.id"
              class="hover:bg-surface-container-low/30 transition-colors"
            >
              <td class="px-8 py-5 font-semibold text-on-surface text-sm">{{ item.title }}</td>
              <td class="px-8 py-5 text-sm text-on-surface-variant">{{ item.client }}</td>
              <td class="px-8 py-5">
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
              <td class="px-8 py-5 text-right">
                <RouterLink
                  :to="`/case-studies/${item.id}`"
                  class="p-2 text-secondary hover:bg-surface-container-high rounded-lg transition-colors inline-block"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
