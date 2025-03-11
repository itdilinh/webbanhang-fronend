export default defineNuxtRouteMiddleware((to, from) => {
    const user = useCookie("user");
    if (!user.value || user.value.role !== "admin") {
      return navigateTo("/"); // Chuyển hướng về trang chủ
    }
  });
  