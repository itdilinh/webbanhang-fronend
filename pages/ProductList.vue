<template>
    <v-container>
      <h1 class="text-h4 mb-4">Sản phẩm</h1>
  
      <v-text-field v-model="search" label="Tìm kiếm sản phẩm..." clearable></v-text-field>
      <v-select v-model="selectedCategory" :items="categories" item-title="name" item-value="id" label="Chọn danh mục" clearable></v-select>
      <v-btn color="blue" @click="fetchProducts()">Tìm kiếm</v-btn>
  
      <v-row>
        <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4">
          <v-card>
            <v-img :src="product.image" height="200"></v-img>
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-subtitle>{{ product.category_name }}</v-card-subtitle>
            <v-card-text>{{ product.price.toLocaleString() }} VND</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const products = ref([]);
  const categories = ref([]);
  const search = ref("");
  const selectedCategory = ref(null);
  
  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    const { data } = await axios.get("/products", {
      params: { search: search.value, category: selectedCategory.value },
    });
    products.value = data;
  };
  
  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    categories.value = data;
  };
  
  onMounted(() => {
    fetchProducts();
    fetchCategories();
  });
  </script>
  