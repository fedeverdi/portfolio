<script setup lang="ts">
const { t } = await useTexts()

const footerLinks = computed(() => [
  { label: 'LinkedIn', href: t('contact.linkedin_url', 'https://linkedin.com/in/federicoverdi') },
  { label: 'GitHub', href: t('contact.github_url', 'https://github.com/federicoverdi') },
  { label: 'Email', href: `mailto:${t('contact.email', 'federicoverdi@me.com')}` }
])
</script>

<template>
  <footer class="bg-stone-950 border-t border-stone-900">
    <div class="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-7xl mx-auto">
      <div class="mb-8 md:mb-0">
        <div class="text-lg font-bold text-stone-100 mb-2 font-headline">{{ t('footer.logo', 'FV/DEV') }}</div>
        <p class="text-[10px] uppercase tracking-[0.05em] text-stone-500">
          {{ t('footer.tagline', '© 2025 Federico Verdi. Built with Nuxt 3.') }}
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-8">
        <a
          v-for="link in footerLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="text-stone-500 hover:text-slate-300 transition-colors text-[10px] uppercase tracking-[0.05em] font-medium"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </footer>
</template>
