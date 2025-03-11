<template>
    <v-container>
      <h1 class="text-3xl font-bold text-center mb-6">Giỏ hàng</h1>
  
      <v-list v-if="cartStore.items.length">
        <v-list-item v-for="item in cartStore.items" :key="item.id">
          <v-row>
            <v-col cols="3">
              <v-img :src="item.image" height="80px"></v-img>
            </v-col>
            <v-col cols="5">
              <h3>{{ item.name }}</h3>
              <p>{{ formatPrice(item.price) }}</p>
            </v-col>
            <v-col cols="2">
              <v-btn @click="cartStore.removeFromCart(item.id)" color="red">Xóa</v-btn>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
  
      <p v-else class="text-center">Giỏ hàng trống</p>
  
      <v-text-field v-model="discountCode" label="Nhập mã giảm giá"></v-text-field>
      <v-btn color="blue" @click="applyDiscount()">Áp dụng</v-btn>
  
      <h2 class="text-h5 mt-4">Tổng tiền: {{ cartStore.totalPrice }} VND</h2>
  
      <v-btn v-if="cartStore.items.length" color="green" block class="mt-4">
        Thanh toán ({{ formatPrice(cartStore.totalPrice) }})
      </v-btn>
    </v-container>
  </template>
  
  <script setup>
  definePageMeta({ middleware: "auth" });
  
  import { ref } from "vue";
  import { useAuthStore } from "@/store/auth";
  import { useRouter } from "vue-router";
  import { useCartStore } from "@/store/cart";
  
  const cartStore = useCartStore();
  const discountCode = ref("");
  
  const applyDiscount = () => {
    cartStore.applyDiscount(discountCode.value);
  };
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  if (!authStore.token) {
    router.push("/login");
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };
  </script>
  