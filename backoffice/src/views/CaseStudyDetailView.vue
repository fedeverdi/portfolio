<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCaseStudiesStore, type CaseStudy } from '@/stores/caseStudies'
import ImageUpload from '@/components/ImageUpload.vue'
import RichEditor from '@/components/RichEditor.vue'

const route = useRoute()
const router = useRouter()
const store = useCaseStudiesStore()

const isNew = computed(() => route.params.id === undefined || route.name === 'CaseStudyNew')
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({
  title: '',
  client: '',
  description: '',
  tags: '' as string,
  status: 'draft' as CaseStudy['status'],
  coverImage: '',
  content: ''
})

onMounted(async () => {
  if (!isNew.value) {
    const item = await store.fetchOne(route.params.id as string)
    if (!item) { router.push('/case-studies'); return }
    form.value = {
      title: item.title,
      client: item.client,
      description: item.description,
      tags: item.tags.join(', '),
      status: item.status,
      coverImage: item.coverImage ?? '',
      content: item.content ?? ''
    }
  }
})

async function save() {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const payload = {
      ...form.value,
      tags: form.value.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    if (isNew.value) {
      await store.create(payload)
      successMsg.value = 'Case study creato con successo.'
      router.push('/case-studies')
    } else {
      await store.update(route.params.id as string, payload)
      successMsg.value = 'Modifiche salvate.'
    }
  } catch (e) {
    errorMsg.value = (e as Error).message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="pb-16 px-12 min-h-screen pt-10">
    <!-- Breadcrumbs & header -->
    <div class="mb-12">
      <nav class="flex items-center gap-2 text-[0.6875rem] font-label uppercase tracking-wider text-on-surface-variant mb-4">
        <RouterLink to="/case-studies" class="hover:text-primary transition-colors">Case Studies</RouterLink>
        <span class="material-symbols-outlined text-[12px]">chevron_right</span>
        <span class="text-primary font-bold">{{ isNew ? 'New Case Study' : 'Edit Case Study' }}</span>
      </nav>

      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-4xl font-bold tracking-tight text-on-surface mb-2">
            {{ isNew ? 'New Case Study' : 'Refining the Narrative' }}
          </h2>
          <p class="text-on-surface-variant text-sm max-w-xl">
            {{ isNew
              ? 'Crea un nuovo case study per il portfolio.'
              : 'Modifica la documentazione tecnica e gli asset del progetto.' }}
          </p>
        </div>
        <div class="flex gap-4">
          <RouterLink
            to="/case-studies"
            class="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-xl font-medium text-sm hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </RouterLink>
          <button
            :disabled="saving"
            class="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            @click="save"
          >
            <span class="material-symbols-outlined text-sm">save</span>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="errorMsg" class="mb-6 px-4 py-3 bg-error/10 text-error text-sm rounded-xl border border-error/20">
      {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="mb-6 px-4 py-3 bg-primary/10 text-primary text-sm rounded-xl border border-primary/20">
      {{ successMsg }}
    </div>

    <!-- Form bento grid -->
    <div class="grid grid-cols-12 gap-8">
      <!-- Main fields -->
      <div class="col-span-12 lg:col-span-8 space-y-8">
        <!-- Core info -->
        <section class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1.5 h-1.5 rounded-full bg-primary" />
            <h3 class="font-semibold text-lg text-on-surface">Core Information</h3>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Project Title</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Dashboard Analytics Real-Time"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Client</label>
              <input
                v-model="form.client"
                type="text"
                placeholder="e.g. Client A"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Brief description of the project and its outcomes..."
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </section>

        <!-- Content -->
        <section class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1.5 h-1.5 rounded-full bg-secondary" />
            <h3 class="font-semibold text-lg text-on-surface">Detailed Content</h3>
          </div>
          <RichEditor v-model="form.content" />
        </section>
      </div>

      <!-- Sidebar fields -->
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <!-- Status & Tags -->
        <section class="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <h3 class="font-semibold text-on-surface">Publishing</h3>
          </div>
          <div class="space-y-5">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Status</label>
              <select
                v-model="form.status"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tags (comma separated)</label>
              <input
                v-model="form.tags"
                type="text"
                placeholder="Vue 3, TypeScript, Pinia"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in form.tags.split(',').map(t => t.trim()).filter(Boolean)"
                  :key="tag"
                  class="px-2.5 py-1 bg-primary/10 text-primary text-[0.6875rem] font-bold rounded-full uppercase tracking-wider"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Cover image -->
        <section class="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)]">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1.5 h-1.5 rounded-full bg-outline" />
            <h3 class="font-semibold text-on-surface">Cover Image</h3>
          </div>
          <ImageUpload v-model="form.coverImage" />
        </section>
      </div>
    </div>
  </div>
</template>
