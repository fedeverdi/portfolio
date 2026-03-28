<script setup lang="ts">
function scrollToPortfolio() {
  document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section
    id="profile"
    class="relative min-h-[921px] flex flex-col justify-center px-8 max-w-7xl mx-auto blueprint-grid"
  >
    <div class="grid grid-cols-12 gap-8 items-center">
      <div class="col-span-12 lg:col-span-8">
        <span class="inline-block text-primary tracking-[0.2em] text-[10px] uppercase mb-6 font-semibold">
          Full-Stack Developer // Vue &amp; Nuxt Specialist
        </span>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter text-on-surface mb-8 font-headline">
          FEDERICO VERDI: BUILDING FAST, SCALABLE WEB EXPERIENCES.
        </h1>
        <p class="text-xl text-on-surface-variant max-w-2xl font-light leading-relaxed mb-12">
          Un developer con focus su UI di qualità, performance e architetture frontend moderne.
          Trasformo idee complesse in prodotti digitali precisi e funzionali.
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            class="bg-primary text-on-primary px-10 py-4 font-bold text-sm tracking-widest uppercase flex items-center gap-3 group rounded"
            @click="scrollToPortfolio"
          >
            Esplora i Progetti
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener"
            class="border border-outline-variant/20 text-on-surface px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-surface-container-high transition-all rounded"
          >
            Download CV
          </a>
        </div>
      </div>
    </div>

    <!-- Technical metadata decoration -->
    <div class="absolute bottom-12 right-8 hidden lg:block text-right">
      <div class="font-mono text-[10px] text-stone-500 space-y-1">
        <p>LOCATION: ITALY</p>
        <p>STACK: VUE_NUXT_TS</p>
        <p>STATUS: AVAILABLE</p>
      </div>
    </div>
  </section>
</template>
