<template>
    <v-container>
      <v-alert type="success" class="text-center">
        Thanh toán thành công! Mã đơn hàng: {{ orderId }}
      </v-alert>
    </v-container>
  </template>
  
  <script setup>
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const orderId = route.query.orderId;
  </script>
  