<template>
    <v-container>
      <v-card v-if="product">
        <v-img :src="product.image" height="300px"></v-img>
        <v-card-title>{{ product.name }}</v-card-title>
        <v-card-subtitle>{{ formatPrice(product.price) }}</v-card-subtitle>
        <v-card-text>{{ product.description }}</v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="addToCart">Thêm vào giỏ hàng</v-btn>
        </v-card-actions>
      </v-card>
      <p v-else class="text-center">Đang tải...</p>
    </v-container>
  </template>
  
  <script setup>
  const route = useRoute();
  const product = ref(null);
  
  const fetchProduct = async () => {
    try {
      const { data } = await useFetch(`/products/${route.params.id}`);
      product.value = data.value;
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };
  
  onMounted(fetchProduct);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };
  
  const addToCart = () => {
    alert("Đã thêm vào giỏ hàng!");
  };
  definePageMeta({ middleware: "auth" });
  </script>
  