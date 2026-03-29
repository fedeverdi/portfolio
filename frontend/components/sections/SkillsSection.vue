<script setup lang="ts">
const { t } = await useTexts()

interface Skill {
  name: string
  level: 'PRO' | 'ADV' | 'MID'
}

interface SkillCategory {
  icon: string
  title: string
  skills: Skill[]
}

const categories: SkillCategory[] = [
  {
    icon: 'terminal',
    title: 'Frontend',
    skills: [
      { name: 'Vue 3 / Nuxt 3', level: 'PRO' },
      { name: 'TypeScript', level: 'PRO' },
      { name: 'Tailwind CSS', level: 'PRO' }
    ]
  },
  {
    icon: 'database',
    title: 'Backend & Data',
    skills: [
      { name: 'Node.js', level: 'ADV' },
      { name: 'REST / GraphQL', level: 'ADV' },
      { name: 'PostgreSQL', level: 'MID' }
    ]
  },
  {
    icon: 'deployed_code',
    title: 'Tooling & DevOps',
    skills: [
      { name: 'Git / GitHub', level: 'PRO' },
      { name: 'Vite / Webpack', level: 'ADV' },
      { name: 'Vercel / Netlify', level: 'ADV' }
    ]
  }
]
</script>

<template>
  <section
    id="skills"
    class="bg-surface-container-lowest py-24 px-8 border-t border-stone-900"
  >
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-12 gap-y-12 lg:gap-12">
        <!-- Intro text -->
        <div class="col-span-12 lg:col-span-4">
          <h2 class="text-3xl font-bold tracking-tight mb-6 font-headline">
            {{ t('skills.title', 'TECHNICAL SUMMARY') }}
          </h2>
          <p class="text-on-surface-variant leading-relaxed">
            {{ t('skills.description', '') }}
          </p>
        </div>

        <!-- Skill cards -->
        <div class="col-span-12 lg:col-span-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            <div
              v-for="cat in categories"
              :key="cat.title"
              class="bg-surface p-8 border border-outline-variant/10 rounded"
            >
              <span class="material-symbols-outlined text-primary mb-4 block">{{ cat.icon }}</span>
              <h3 class="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-4">
                {{ cat.title }}
              </h3>
              <ul class="space-y-2 text-sm">
                <li
                  v-for="skill in cat.skills"
                  :key="skill.name"
                  class="flex justify-between"
                >
                  <span>{{ skill.name }}</span>
                  <span class="text-primary/50">{{ skill.level }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
