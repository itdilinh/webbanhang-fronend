<template>
    <v-container>
      <h1 class="text-3xl font-bold text-center mb-6">Lịch sử đơn hàng</h1>
  
      <!-- Nếu không có đơn hàng -->
      <v-alert v-if="orders.length === 0" type="info">Chưa có đơn hàng nào.</v-alert>
  
      <!-- Nếu có đơn hàng -->
      <v-list v-else>
        <v-list-item v-for="order in orders" :key="order.id">
          <v-list-item-content>
            <v-list-item-title>Mã đơn hàng: {{ order.id }}</v-list-item-title>
            <v-list-item-subtitle>
              Tổng tiền: {{ formatPrice(order.total_price) }} - Trạng thái: {{ order.status }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  
    <!-- Quản lý đơn hàng cho Admin -->
    <v-container v-if="authStore.user?.role === 'admin'">
      <h1 class="text-h4">Quản lý đơn hàng</h1>
      <v-data-table :items="orders" :headers="headers" class="elevation-1">
        <template v-slot:item.status="{ item }">
          <v-chip :color="statusColor(item.status)">{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn color="blue" @click="viewOrder(item.id)">Chi tiết</v-btn>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script setup>
  import { useAuthStore } from "@/store/auth";
  import axios from "axios";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  const authStore = useAuthStore();
  const router = useRouter();
  const orders = ref([]);
  
  const headers = [
    { title: "ID", key: "id" },
    { title: "Khách hàng", key: "customer" },
    { title: "Tổng tiền", key: "total_price" },
    { title: "Trạng thái", key: "status" },
    { title: "Ngày tạo", key: "created_at" },
    { title: "Thao tác", key: "action", sortable: false },
  ];
  
  const statusColor = (status) => {
    return status === "pending" ? "orange" :
           status === "confirmed" ? "blue" :
           status === "shipped" ? "green" :
           "gray";
  };
  
  const viewOrder = (id) => {
    router.push(`/admin/orders/${id}`);
  };
  
  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      if (authStore.user?.role === "admin") {
        // Nếu là Admin -> Lấy tất cả đơn hàng
        const { data } = await axios.get("/admin/orders");
        orders.value = data;
      } else {
        // Nếu là User -> Lấy đơn hàng của cá nhân
        const { data } = await axios.get(`/orders/${authStore.user.id}`);
        orders.value = data;
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };
  
  onMounted(fetchOrders);
  
  // Hàm format giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  </script>
  