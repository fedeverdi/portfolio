<script setup lang="ts">
interface CaseStudy {
  id: string
  title: string
  client: string
  description: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  coverImage?: string
  createdAt: string
}

const config = useRuntimeConfig()

const { data, status } = await useFetch<CaseStudy[]>(
  `${config.public.apiBase}/api/public/case-studies`,
  { server: true, default: () => [] }
)

const projects = computed(() => data.value ?? [])

useSeoMeta({
  title: 'Portfolio — Federico Verdi',
  description: 'All case studies and projects by Federico Verdi — Senior Web Developer & Solutions Architect.'
})

function specNo(index: number) {
  return `SPEC_NO: ${String(index + 1).padStart(4, '0')}`
}
</script>

<template>
  <div class="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container">
    <TheNavbar />

    <main class="pt-20">
      <section class="py-24 px-8 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-16">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-on-surface transition-colors mb-10"
          >
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Home
          </NuxtLink>
          <h1 class="text-5xl md:text-7xl font-bold tracking-tighter font-headline mb-4">
            ALL PROJECTS
          </h1>
          <p class="text-stone-500 uppercase tracking-widest text-[10px]">
            Case Studies / Engineering Records
          </p>
        </div>

        <!-- Loading -->
        <div v-if="status === 'pending'" class="py-24 text-center text-on-surface-variant text-sm">
          Loading projects...
        </div>

        <!-- Empty -->
        <div v-else-if="projects.length === 0" class="py-24 text-center text-on-surface-variant text-sm">
          No published projects yet.
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.id"
            :to="`/case-studies/${project.id}`"
            class="group relative bg-surface-container border border-outline-variant/5 overflow-hidden rounded block"
          >
            <!-- Cover image / placeholder -->
            <div class="aspect-[16/10] bg-surface-container-lowest relative overflow-hidden">
              <img
                v-if="project.coverImage"
                :src="project.coverImage"
                :alt="project.title"
                class="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              >
                <span class="material-symbols-outlined text-8xl text-primary">image</span>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-[10px] tracking-[0.5em] text-stone-600 font-mono">
                  {{ specNo(index) }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-12">
              <h2 class="text-2xl font-bold mb-4 font-headline">{{ project.title }}</h2>
              <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                {{ project.description }}
              </p>
              <div class="flex gap-3 flex-wrap">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-3 py-1 bg-surface-container-high text-[10px] font-mono border border-outline-variant/20 uppercase rounded"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Arrow -->
              <div class="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500 group-hover:text-on-surface transition-colors">
                <span>View case study</span>
                <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
