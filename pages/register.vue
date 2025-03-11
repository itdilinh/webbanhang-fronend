<template>
    <v-container>
      <v-card class="mx-auto" max-width="400">
        <v-card-title class="text-center">Đăng ký</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleRegister">
            <v-text-field v-model="name" label="Tên" required></v-text-field>
            <v-text-field v-model="email" label="Email" required></v-text-field>
            <v-text-field v-model="password" label="Mật khẩu" type="password" required></v-text-field>
            <v-btn type="submit" color="primary" block>Đăng ký</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/login" text block>Đã có tài khoản? Đăng nhập</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const name = ref("");
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  
  const handleRegister = () => {
    alert("Đăng ký thành công! Chuyển đến trang đăng nhập.");
    router.push("/login");
  };
  </script>
  