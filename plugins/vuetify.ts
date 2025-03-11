export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const fetchInstance = (url: string, options: any = {}) => {
    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
    });
  };

  return {
    provide: {
      axios: fetchInstance, // Giữ tên `axios` để tương thích
    },
  };
});
