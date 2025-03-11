<template>
    <v-container>
      <h1 class="text-h4">Dashboard</h1>
  
      <v-row>
        <v-col cols="6">
          <v-card class="pa-4" color="blue">
            <h2 class="text-h5">Tổng doanh thu</h2>
            <p class="text-h6">{{ revenue }} VND</p>
          </v-card>
        </v-col>
  
        <v-col cols="6">
          <v-card class="pa-4" color="green">
            <h2 class="text-h5">Tổng đơn hàng</h2>
            <p class="text-h6">{{ orders }} đơn</p>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Doanh thu 7 ngày qua</v-card-title>
            <v-card-text>
              <apexchart type="line" :options="chartOptions" :series="chartSeries"></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const revenue = ref(0);
  const orders = ref(0);
  const chartSeries = ref([]);
  const chartOptions = ref({
    chart: { type: "line" },
    xaxis: { categories: [] },
    yaxis: { title: { text: "Doanh thu (VND)" } },
  });
  
  const fetchStats = async () => {
    const { data } = await axios.get("/admin/stats");
    revenue.value = data.totalRevenue;
    orders.value = data.totalOrders;
  
    chartSeries.value = [{ name: "Doanh thu", data: data.dailyRevenue.map(d => d.revenue) }];
    chartOptions.value.xaxis.categories = data.dailyRevenue.map(d => d.date);
  };
  
  onMounted(fetchStats);
  </script>
  