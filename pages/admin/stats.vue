<template>
    <v-container>
      <h1 class="text-h4 mb-4">Thống kê Doanh thu</h1>
  
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <h3>Tổng số đơn hàng</h3>
            <h2 class="text-h5">{{ stats.total_orders }}</h2>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <h3>Tổng doanh thu</h3>
            <h2 class="text-h5">{{ stats.revenue.toLocaleString() }} VNĐ</h2>
          </v-card>
        </v-col>
      </v-row>
  
      <v-divider class="my-4"></v-divider>
  
      <h3 class="text-h5">Doanh thu theo ngày</h3>
      <v-chart class="my-4" :options="chartOptions"></v-chart>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { use } from "echarts/core";
  import { LineChart } from "echarts/charts";
  import { CanvasRenderer } from "echarts/renderers";
  import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
  import VChart from "vue-echarts";
  
  use([GridComponent, TooltipComponent, LegendComponent, LineChart, CanvasRenderer]);
  
  const stats = ref({ total_orders: 0, revenue: 0 });
  const chartOptions = ref({});
  
  const loadStats = async () => {
    const { data } = await axios.get("/stats/overview");
    stats.value = data;
  };
  
  const loadDailyRevenue = async () => {
    const { data } = await axios.get("/stats/daily");
    chartOptions.value = {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: data.map((item) => item.date) },
      yAxis: { type: "value" },
      series: [{ name: "Doanh thu", type: "line", data: data.map((item) => item.revenue) }],
    };
  };
  
  onMounted(async () => {
    await loadStats();
    await loadDailyRevenue();
  });
  definePageMeta({ middleware: "auth" });
  </script>
  