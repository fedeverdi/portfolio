<template>
  <div class="bg-[#161311] text-[#e9e1dd] min-h-screen flex flex-col items-center justify-center relative overflow-hidden blueprint-grid selection:bg-primary-container selection:text-on-primary-container">

    <!-- Top-left label -->
    <div class="absolute top-8 left-8 font-mono text-[10px] text-stone-500 tracking-widest uppercase">
      federicoverdi.it // portfolio
    </div>

    <!-- Top-right metadata -->
    <div class="absolute top-8 right-8 font-mono text-[10px] text-stone-500 text-right space-y-1 hidden md:block">
      <p>STATUS: BUILDING</p>
      <p>ETA: SOON™</p>
    </div>

    <!-- Main content -->
    <div class="text-center px-8 max-w-4xl">
      <span class="inline-block text-primary tracking-[0.2em] text-[10px] uppercase mb-6 font-semibold">
        Full-Stack Developer // Senior Web Developer &amp; Solutions Architect
      </span>

      <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter font-headline mb-8">
        UNDER<br />CONSTRUCTION.
      </h1>

      <p class="text-xl text-stone-400 font-light leading-relaxed max-w-xl mx-auto mb-12">
        Qualcosa di nuovo sta prendendo forma. Torna presto.
      </p>

      <a
        href="mailto:federicoverdi@me.com"
        class="inline-flex items-center gap-3 border border-stone-700 text-[#e9e1dd] px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-all rounded group"
      >
        Contattami
        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </a>
    </div>

    <!-- Bottom-right decoration -->
    <div class="absolute bottom-8 right-8 font-mono text-[10px] text-stone-600 text-right space-y-1 hidden lg:block">
      <p>LOCATION: ITALY</p>
      <p>STACK: VUE_NUXT_TS</p>
    </div>

    <!-- Bottom-left decoration -->
    <div class="absolute bottom-8 left-8 font-mono text-[10px] text-stone-600">
      © {{ new Date().getFullYear() }} Federico Verdi
    </div>

  </div>
</template>
