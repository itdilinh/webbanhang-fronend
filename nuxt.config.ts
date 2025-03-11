export default defineNuxtConfig({
  modules: [
  
    '@pinia/nuxt',
    '@nuxtjs-alt/axios'
    
  ],

  axios: {
    baseURL: "http://localhost:5000/api"
  },

  css: [
    '@/assets/main.css',
    'vuetify/styles'
  ],

  build: {
    transpile: ['vuetify']
  },

  
  compatibilityDate: '2025-03-10'
})