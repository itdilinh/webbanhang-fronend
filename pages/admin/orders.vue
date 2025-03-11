<template>
    <v-container>
      <h1 class="text-h4 mb-4">Quản lý Đơn Hàng</h1>
      <v-table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ order.total_price.toLocaleString() }} VNĐ</td>
            <td>
              <v-chip :color="getStatusColor(order.status)">{{ order.status }}</v-chip>
            </td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>
              <v-btn color="blue" @click="viewOrder(order.id)">Xem</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  definePageMeta({ middleware: "auth" });
  const orders = ref([]);
  const router = useRouter();
  
  const getStatusColor = (status) => {
    return status === "pending"
      ? "orange"
      : status === "completed"
      ? "green"
      : "red";
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  
  const loadOrders = async () => {
    const { data } = await axios.get("/orders");
    orders.value = data;
  };
  
  const viewOrder = (id) => {
    router.push(`/admin/orders/${id}`);
  };
  
  onMounted(loadOrders);
  </script>
  