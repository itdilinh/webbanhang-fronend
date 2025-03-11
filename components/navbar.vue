<template>
    <v-app-bar color="primary" dark>
      <v-container class="d-flex align-center">
        <v-btn to="/" text>Trang chủ</v-btn>
        <v-btn to="/products" text>Sản phẩm</v-btn>
        <v-btn to="/cart" text>Giỏ hàng</v-btn>
        <v-spacer></v-spacer>
        <template v-if="authStore.user">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text>{{ authStore.user.name }}</v-btn>
            </template>
            <v-list>
              <v-list-item @click="handleLogout">Đăng xuất</v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn to="/login" text>Đăng nhập</v-btn>
        </template>
      </v-container>
    </v-app-bar>
  </template>
  
  <script setup>
  import { useAuthStore } from "@/store/auth";
  
  const authStore = useAuthStore();
  const handleLogout = () => {
    authStore.logout();
    alert("Đã đăng xuất!");
  };
  </script>
  