<script setup lang="ts">
const { t } = await useTexts()

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitted = ref(false)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  // Simulate async submission — replace with real API call
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  submitted.value = true
  form.name = ''
  form.email = ''
  form.message = ''
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
            :href="`mailto:${t('contact.email', 'federicoverdi@me.com')}`"
            class="text-2xl font-light hover:text-primary transition-colors underline underline-offset-8 decoration-stone-700"
          >
            {{ t('contact.email', 'federicoverdi@me.com') }}
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
              Messaggio inviato! Ti rispondo al più presto.
            </p>
            <button
              class="text-[10px] uppercase tracking-widest text-stone-400 hover:text-on-surface transition-colors underline underline-offset-4"
              @click="submitted = false"
            >
              Invia un altro messaggio
            </button>
          </div>

          <form
            v-else
            key="form"
            class="space-y-8"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div class="group relative">
              <label class="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">
                Nome
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Il tuo nome"
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
                placeholder="La tua email"
                class="w-full bg-transparent border-0 border-b-2 border-outline-variant py-4 px-0 focus:ring-0 focus:border-primary transition-colors placeholder:text-stone-700 rounded-t text-on-surface"
              />
            </div>
            <div class="group relative">
              <label class="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">
                Messaggio
              </label>
              <textarea
                v-model="form.message"
                required
                rows="4"
                placeholder="Descrivi il progetto o la tua richiesta"
                class="w-full bg-transparent border-0 border-b-2 border-outline-variant py-4 px-0 focus:ring-0 focus:border-primary transition-colors placeholder:text-stone-700 resize-none rounded-t text-on-surface"
              />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary text-on-primary w-full py-6 font-bold text-sm tracking-widest uppercase hover:bg-primary-fixed-dim transition-all rounded disabled:opacity-60 disabled:cursor-wait"
            >
              {{ loading ? 'Invio in corso...' : 'Invia Messaggio' }}
            </button>
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
