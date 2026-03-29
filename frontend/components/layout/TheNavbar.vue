<script setup lang="ts">
const route = useRoute()

const scrollLinks = [
  { label: 'Profile', href: '#profile' },
  { label: 'Skills', href: '#skills' }
]

const activeSection = ref('profile')
const menuOpen = ref(false)

const router = useRouter()

function scrollTo(href: string) {
  menuOpen.value = false
  if (route.path !== '/') {
    router.push(`/${href}`)
    return
  }
  router.replace({ hash: href })
  const el = document.querySelector(href)
  el?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.3 }
  )
  scrollLinks.forEach(({ href }) => {
    const el = document.querySelector(href)
    if (el) observer.observe(el)
  })
  const contactEl = document.querySelector('#contact')
  if (contactEl) observer.observe(contactEl)
})
</script>

<template>
  <nav class="fixed top-0 w-full z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/20">
    <div class="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
      <!-- Logo -->
      <NuxtLink to="/" class="text-xl font-bold tracking-tighter text-slate-100 font-headline hover:opacity-80 transition-opacity">
        FV/DEV
      </NuxtLink>

      <!-- Desktop Links -->
      <div class="hidden md:flex items-center space-x-12">
        <a
          v-for="link in scrollLinks"
          :key="link.href"
          :href="link.href"
          class="text-[0.75rem] tracking-widest uppercase font-medium transition-colors"
          :class="route.path === '/' && activeSection === link.href.slice(1)
            ? 'text-slate-100 border-b-2 border-slate-400 pb-1'
            : 'text-stone-400 hover:text-slate-200'"
          @click.prevent="scrollTo(link.href)"
        >
          {{ link.label }}
        </a>
        <NuxtLink
          to="/portfolio"
          class="text-[0.75rem] tracking-widest uppercase font-medium transition-colors"
          :class="route.path === '/portfolio'
            ? 'text-slate-100 border-b-2 border-slate-400 pb-1'
            : 'text-stone-400 hover:text-slate-200'"
        >
          Portfolio
        </NuxtLink>
        <a
          href="/#contact"
          class="text-[0.75rem] tracking-widest uppercase font-medium transition-colors"
          :class="route.path === '/' && activeSection === 'contact'
            ? 'text-slate-100 border-b-2 border-slate-400 pb-1'
            : 'text-stone-400 hover:text-slate-200'"
          @click.prevent="scrollTo('#contact')"
        >Contact</a>
      </div>

      <!-- CTA -->
      <button
        class="hidden md:block bg-primary text-on-primary px-6 py-2 text-[0.75rem] tracking-widest uppercase font-bold hover:bg-primary-fixed-dim transition-all duration-300 rounded"
        @click="scrollTo('#contact')"
      >
        Get in Touch
      </button>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden text-slate-100 focus:outline-none"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="material-symbols-outlined text-2xl">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="menuOpen"
        class="md:hidden bg-stone-950 border-t border-stone-800/30 px-8 py-6 flex flex-col gap-6"
      >
        <a
          v-for="link in scrollLinks"
          :key="link.href"
          :href="link.href"
          class="text-[0.75rem] tracking-widest uppercase font-medium text-stone-300 hover:text-white transition-colors"
          @click.prevent="scrollTo(link.href)"
        >
          {{ link.label }}
        </a>
        <NuxtLink
          to="/portfolio"
          class="text-[0.75rem] tracking-widest uppercase font-medium transition-colors"
          :class="route.path === '/portfolio' ? 'text-white' : 'text-stone-300 hover:text-white'"
          @click="menuOpen = false"
        >
          Portfolio
        </NuxtLink>
        <a
          href="/#contact"
          class="text-[0.75rem] tracking-widest uppercase font-medium text-stone-300 hover:text-white transition-colors"
          @click.prevent="scrollTo('#contact')"
        >Contact</a>
        <button
          class="bg-primary text-on-primary px-6 py-3 text-[0.75rem] tracking-widest uppercase font-bold rounded w-full"
          @click="scrollTo('#contact')"
        >
          Get in Touch
        </button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
