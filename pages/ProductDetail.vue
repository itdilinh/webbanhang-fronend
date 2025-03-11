<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-img :src="product.image" height="300"></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <h1>{{ product.name }}</h1>
          <p>Giá: {{ product.price.toLocaleString() }} VND</p>
          <p>Số lượng tồn kho: <strong :class="{'text-red': product.stock <= 5}">{{ product.stock }}</strong></p>
          <v-btn color="blue" @click="addToCart(product)">Thêm vào giỏ</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useCartStore } from "@/store/cart";
  import axios from "axios";
  
  const route = useRoute();
  const product = ref({});
  const cartStore = useCartStore();
  
  const fetchProduct = async () => {
    const { data } = await axios.get(`/products/${route.params.id}`);
    product.value = data;
  };
  
  const addToCart = (product) => {
    cartStore.addToCart(product);
  };
  
  onMounted(fetchProduct);
  </script>
  