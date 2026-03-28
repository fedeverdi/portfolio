export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://api-portfolio.federicoverdi.it', // overridden by NUXT_PUBLIC_API_BASE in dev
      turnstileSiteKey: '0x4AAAAAACxUAfyDs5QDQFxj'
    }
  },
  nitro: {
    preset: process.env.NODE_ENV === 'development' ? undefined : 'cloudflare_pages',
    routeRules: process.env.NODE_ENV === 'development'
      ? { '/api/**': { proxy: 'http://localhost:4000/api/**' } }
      : { '/': { headers: { 'cache-control': 'public, s-maxage=31536000, max-age=0, must-revalidate' } } }
  },
  app: {
    head: {
      htmlAttrs: { class: 'dark', lang: 'it' },
      title: 'Federico Verdi — Portfolio',
      meta: [
        { name: 'description', content: 'Portfolio personale di Federico Verdi — Web Developer' }
      ],
      script: [
        { src: 'https://challenges.cloudflare.com/turnstile/v0/api.js', defer: true }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;500;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
        }
      ]
    }
  },
  compatibilityDate: '2024-11-01'
})
