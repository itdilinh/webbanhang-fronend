<template>
    <v-container>
      <h1 class="text-3xl font-bold text-center mb-6">Xác nhận đơn hàng</h1>
      <v-card class="mx-auto" max-width="600">
        <v-list>
          <v-list-item v-for="item in cartStore.cart" :key="item.id">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.quantity }} x {{ formatPrice(item.price) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-text class="text-right">
          <strong>Tổng tiền: {{ formatPrice(totalPrice) }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" block @click="handleOrder">Đặt hàng</v-btn>
          <v-btn color="blue" block @click="handleVNPayPayment">Thanh toán VNPay</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { useCartStore } from "@/store/cart";
  import { useAuthStore } from "@/store/auth";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import { computed } from "vue";
  
  // Middleware bảo vệ trang
  definePageMeta({ middleware: "auth" });
  
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Tính tổng tiền
  const totalPrice = computed(() =>
    cartStore.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  
  // Hàm format giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  
  // Xử lý đặt hàng
  const handleOrder = async () => {
    if (!authStore.user) {
      alert("Vui lòng đăng nhập để đặt hàng.");
      router.push("/login");
      return;
    }
  
    try {
      const orderId = await cartStore.placeOrder(authStore.user.id);
      alert("Đơn hàng đã được đặt! Mã đơn hàng: " + orderId);
      router.push("/orders");
    } catch (error) {
      alert(error.message);
    }
  };
  
  // Xử lý thanh toán VNPay
  const handleVNPayPayment = async () => {
    if (!authStore.user) {
      alert("Vui lòng đăng nhập để thanh toán.");
      router.push("/login");
      return;
    }
  
    try {
      const totalPrice = cartStore.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      // Gọi API tạo đơn hàng trước
      const orderId = await cartStore.placeOrder(authStore.user.id);
      
      // Gọi API backend để tạo URL thanh toán
      const { data } = await axios.post("/payment/create-payment", {
        amount: totalPrice,
        orderId,
      });
  
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = data.paymentUrl;
    } catch (error) {
      alert("Thanh toán thất bại!");
    }
  };
  </script>
  