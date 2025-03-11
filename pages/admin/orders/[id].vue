<template>
    <v-container v-if="order">
      <h1 class="text-h4">Chi tiết đơn hàng #{{ order.id }}</h1>
  
      <v-card class="pa-4 my-4">
        <p><strong>Khách hàng:</strong> {{ order.customer }} ({{ order.email }})</p>
        <p><strong>Tổng tiền:</strong> {{ order.amount }} VND</p>
        <p><strong>Trạng thái:</strong> 
          <v-select :items="statuses" v-model="order.status" @update:modelValue="updateStatus"></v-select>
        </p>
      </v-card>
  
      <v-card class="pa-4">
        <h2 class="text-h5">Sản phẩm trong đơn hàng</h2>
        <v-data-table :items="items" :headers="headers" class="elevation-1"></v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const order = ref(null);
  const items = ref([]);
  const statuses = ["pending", "confirmed", "shipped", "completed"];
  
  const fetchOrder = async () => {
    const { data } = await axios.get(`/admin/orders/${route.params.id}`);
    order.value = data.order;
    items.value = data.items;
  };
  
  const updateStatus = async () => {
    await axios.put(`/admin/orders/${order.value.id}/status`, { status: order.value.status });
  };
  
  onMounted(fetchOrder);
  </script>
  