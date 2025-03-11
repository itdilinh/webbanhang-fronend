<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    alert("Đăng nhập thành công!");
    router.push("/");
  } catch (error) {
    alert(error.message);
  }
};
</script>
