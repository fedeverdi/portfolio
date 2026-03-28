<script setup lang="ts">
interface CaseStudy {
  id: string
  title: string
  client: string
  description: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  coverImage?: string | null
  content?: string | null
  createdAt: string
  updatedAt: string
}

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = (config.public.apiBase as string) || 'https://api-portfolio.federicoverdi.it'

const { data: project, error } = await useFetch<CaseStudy>(
  `${apiBase}/api/public/case-studies/${route.params.id}`,
  { server: true }
)

if (error.value || !project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

useSeoMeta({
  title: `${project.value.title} — Federico Verdi`,
  description: project.value.description
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long'
  })
}
</script>

<template>
  <div class="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container">
    <TheNavbar />

    <main class="pt-20">
      <!-- Hero -->
      <section class="px-8 py-24 max-w-7xl mx-auto">
        <div class="grid grid-cols-12 gap-8 items-end mb-16">
          <div class="col-span-12 lg:col-span-8">
            <!-- Back -->
            <NuxtLink
              to="/#portfolio"
              class="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-on-surface transition-colors mb-10"
            >
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              All projects
            </NuxtLink>

            <div class="flex items-center gap-2 mb-4">
              <div class="w-1.5 h-1.5 rounded-full bg-primary" />
              <span class="text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant">
                Case Study
              </span>
            </div>

            <h1 class="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] font-headline mb-6">
              {{ project!.title }}
            </h1>
            <p class="text-on-surface-variant text-xl font-light leading-relaxed max-w-2xl">
              {{ project!.description }}
            </p>
          </div>

          <!-- Meta sidebar -->
          <div class="col-span-12 lg:col-span-4 lg:text-right">
            <dl class="space-y-4 text-sm">
              <div>
                <dt class="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-1">Client</dt>
                <dd class="text-on-surface font-medium">{{ project!.client }}</dd>
              </div>
              <div>
                <dt class="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-1">Date</dt>
                <dd class="text-on-surface font-medium">{{ formatDate(project!.createdAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-3 mb-16">
          <span
            v-for="tag in project!.tags"
            :key="tag"
            class="px-4 py-1.5 bg-surface-container border border-outline-variant/20 text-[10px] font-mono uppercase tracking-wider rounded"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Cover image -->
        <div
          v-if="project!.coverImage"
          class="aspect-[21/9] rounded overflow-hidden mb-24"
        >
          <img
            :src="project!.coverImage"
            :alt="project!.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="aspect-[21/9] rounded overflow-hidden mb-24 bg-surface-container-lowest flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-8xl text-surface-variant">image</span>
        </div>
      </section>

      <!-- Content -->
      <section v-if="project!.content" class="px-8 pb-32 max-w-4xl mx-auto">
        <div
          class="prose prose-invert prose-stone max-w-none prose-headings:font-headline prose-headings:tracking-tighter prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          v-html="project!.content"
        />
      </section>

      <!-- CTA -->
      <section class="px-8 pb-32 max-w-7xl mx-auto">
        <div class="border-t border-outline-variant/20 pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p class="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Next step</p>
            <p class="text-2xl font-bold tracking-tight">Interested in working together?</p>
          </div>
          <a
            href="/#contact"
            class="flex items-center gap-3 bg-primary text-on-primary px-8 py-4 font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all rounded group"
          >
            Get in touch
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
