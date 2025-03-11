export default defineNuxtPlugin(nuxtApp => {
    const axios = useAxios()
  
    // Set default headers or interceptors
    axios.onRequest(config => {
      console.log('Making request with config', config)
    })
  
    // Add Axios to Nuxt app context
    nuxtApp.provide('axios', axios)
  })
  