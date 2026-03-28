<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'https://api-portfolio.federicoverdi.it'

const { data: settings, error } = await useFetch<Record<string, string>>(
  `${apiBase}/api/public/settings`,
  { server: true, default: () => ({ site_status: 'under_construction' }) }
)

const isLive = computed(() => settings.value?.site_status === 'published')
</script>

<template>
  <!-- UNDER CONSTRUCTION -->
  <div v-if="!isLive" class="bg-[#161311] text-[#e9e1dd] min-h-screen flex flex-col items-center justify-center relative overflow-hidden blueprint-grid selection:bg-primary-container selection:text-on-primary-container">
    <div class="absolute top-8 left-8 font-mono text-[10px] text-stone-500 tracking-widest uppercase">
      federicoverdi.it // portfolio
    </div>
    <div class="absolute top-8 right-8 font-mono text-[10px] text-stone-500 text-right space-y-1 hidden md:block">
      <p>STATUS: BUILDING</p>
      <p>ETA: SOON™</p>
    </div>
    <div class="text-center px-8 max-w-4xl">
      <span class="inline-block text-primary tracking-[0.2em] text-[10px] uppercase mb-6 font-semibold">
        Senior Web Developer &amp; Solutions Architect
      </span>
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter font-headline mb-8">
        UNDER<br />CONSTRUCTION.
      </h1>
      <p class="text-xl text-stone-400 font-light leading-relaxed max-w-xl mx-auto mb-12">
        Qualcosa di nuovo sta prendendo forma. Torna presto.
      </p>
      <a
        :href="`mailto:${settings?.contact_email || 'federicoverdi@me.com'}`"
        class="inline-flex items-center gap-3 border border-stone-700 text-[#e9e1dd] px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-all rounded group"
      >
        Contattami
        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </a>
    </div>
    <div class="absolute bottom-8 right-8 font-mono text-[10px] text-stone-600 text-right space-y-1 hidden lg:block">
      <p>LOCATION: ITALY</p>
      <p>STACK: VUE_NUXT_TS</p>
    </div>
    <div class="absolute bottom-8 left-8 font-mono text-[10px] text-stone-600">
      © {{ new Date().getFullYear() }} {{ settings?.owner_name || 'Federico Verdi' }}
    </div>
  </div>

  <!-- FULL PORTFOLIO -->
  <div v-else class="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
    <TheNavbar />
    <main class="pt-20">
      <HeroSection />
      <SkillsSection />
      <PortfolioSection />
      <ContactSection />
    </main>
    <TheFooter />
  </div>
</template>
