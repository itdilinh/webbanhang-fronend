export default {
  plugins: ['~/plugins/axios.plugin.mjs'],

  build: {
    transpile: ['@nuxt/http'],
  },

  compatibilityDate: '2025-03-10'
};