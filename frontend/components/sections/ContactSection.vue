<script setup lang="ts">
const { t } = await useTexts()
const config = useRuntimeConfig()
const apiBase = (config.public.apiBase as string) || 'https://api-portfolio.federicoverdi.it'
const turnstileSiteKey = config.public.turnstileSiteKey as string

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const turnstileToken = ref('')
const turnstileEl = ref<HTMLElement | null>(null)

declare global {
  interface Window {
    turnstile?: { reset: (el: HTMLElement) => void }
    __turnstileCallback?: (token: string) => void
  }
}

onMounted(() => {
  window.__turnstileCallback = (token: string) => {
    turnstileToken.value = token
  }
})

async function handleSubmit() {
  if (!turnstileToken.value) {
    error.value = 'Please complete the security check.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${apiBase}/api/public/contact`, {
      method: 'POST',
      body: { name: form.name, email: form.email, message: form.message, turnstileToken: turnstileToken.value }
    })
    submitted.value = true
    form.name = ''
    form.email = ''
    form.message = ''
    turnstileToken.value = ''
  } catch {
    error.value = 'Something went wrong. Please try again.'
    if (window.turnstile && turnstileEl.value) {
      window.turnstile.reset(turnstileEl.value)
    }
    turnstileToken.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section id="contact" class="bg-surface-container-low py-32 px-8">
    <div class="max-w-7xl mx-auto grid grid-cols-12 gap-8">
      <!-- Left: info -->
      <div class="col-span-12 lg:col-span-6">
        <h2 class="text-5xl font-bold tracking-tighter mb-8 font-headline">
          {{ t('contact.title', 'INIZIAMO A COLLABORARE') }}
        </h2>
        <p class="text-on-surface-variant text-lg max-w-md mb-12">
          {{ t('contact.description', '') }}
        </p>
        <div class="flex flex-col space-y-4">
          <a
            :href="`mailto:${t('contact.email', 'io@federicoverdi.it')}`"
            class="text-2xl font-light hover:text-primary transition-colors underline underline-offset-8 decoration-stone-700"
          >
            {{ t('contact.email', 'io@federicoverdi.it') }}
          </a>
          <div class="flex space-x-8 pt-4">
            <a
              :href="t('contact.linkedin_url', '#')"
              target="_blank"
              rel="noopener"
              class="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-on-surface transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-sm">link</span>
              LinkedIn
            </a>
            <a
              :href="t('contact.github_url', '#')"
              target="_blank"
              rel="noopener"
              class="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-on-surface transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-sm">terminal</span>
              GitHub
            </a>
          </div>
        </div>
      </div>

      <!-- Right: form -->
      <div class="col-span-12 lg:col-span-6 mt-12 lg:mt-0">
        <Transition name="fade" mode="out-in">
          <div v-if="submitted" key="thank-you" class="flex flex-col items-start justify-center h-full gap-4">
            <span class="material-symbols-outlined text-primary text-4xl">check_circle</span>
            <p class="text-on-surface-variant text-lg">
              Message sent! I'll get back to you soon.
            </p>
            <button
              class="text-[10px] uppercase tracking-widest text-stone-400 hover:text-on-surface transition-colors underline underline-offset-4"
              @click="submitted = false"
            >
              Send another message
            </button>
          </div>

          <form
            v-else
            key="form"
            class="space-y-8"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div v-if="error" class="text-sm text-red-500">
              {{ error }}
            </div>
            <div class="group relative">
              <label class="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">
                Name
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Your name"
                class="w-full bg-transparent border-0 border-b-2 border-outline-variant py-4 px-0 focus:ring-0 focus:border-primary transition-colors placeholder:text-stone-700 rounded-t text-on-surface"
              />
            </div>
            <div class="group relative">
              <label class="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="Your email"
                class="w-full bg-transparent border-0 border-b-2 border-outline-variant py-4 px-0 focus:ring-0 focus:border-primary transition-colors placeholder:text-stone-700 rounded-t text-on-surface"
              />
            </div>
            <div class="group relative">
              <label class="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">
                Message
              </label>
              <textarea
                v-model="form.message"
                required
                rows="4"
                placeholder="Describe your project or request"
                class="w-full bg-transparent border-0 border-b-2 border-outline-variant py-4 px-0 focus:ring-0 focus:border-primary transition-colors placeholder:text-stone-700 resize-none rounded-t text-on-surface"
              />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary text-on-primary w-full py-6 font-bold text-sm tracking-widest uppercase hover:bg-primary-fixed-dim transition-all rounded disabled:opacity-60 disabled:cursor-wait"
            >
              {{ loading ? 'Sending...' : 'Send Message' }}
            </button>

            <!-- Cloudflare Turnstile -->
            <div
              ref="turnstileEl"
              class="cf-turnstile"
              :data-sitekey="turnstileSiteKey"
              data-callback="__turnstileCallback"
              data-theme="dark"
            />
          </form>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
