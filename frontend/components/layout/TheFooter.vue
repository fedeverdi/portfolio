<script setup lang="ts">
const footerLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/federicoverdi' },
  { label: 'GitHub', href: 'https://github.com/federicoverdi' },
  { label: 'Email', href: 'mailto:hello@federicoverdi.dev' }
]
</script>

<template>
  <footer class="bg-stone-950 border-t border-stone-900">
    <div class="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-7xl mx-auto">
      <div class="mb-8 md:mb-0">
        <div class="text-lg font-bold text-stone-100 mb-2 font-headline">FV/DEV</div>
        <p class="text-[10px] uppercase tracking-[0.05em] text-stone-500">
          &copy; 2025 Federico Verdi. Built with Nuxt 3.
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
