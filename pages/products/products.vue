<template>
    <v-container>
      <h1 class="text-h4 mb-4">Quản lý Sản phẩm</h1>
      
      <v-btn color="green" @click="openDialog()">Thêm sản phẩm</v-btn>
  
      <v-table class="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Kho</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price.toLocaleString() }} VNĐ</td>
            <td>{{ product.stock }}</td>
            <td><v-img :src="product.image" width="50"></v-img></td>
            <td>
              <v-btn color="blue" @click="editProduct(product)">Sửa</v-btn>
              <v-btn color="red" @click="deleteProduct(product.id)">Xóa</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
  
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title>{{ isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm" }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="form.name" label="Tên sản phẩm"></v-text-field>
            <v-text-field v-model="form.price" label="Giá"></v-text-field>
            <v-text-field v-model="form.stock" label="Kho"></v-text-field>
            <v-text-field v-model="form.image" label="URL ảnh"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="saveProduct()">Lưu</v-btn>
            <v-btn color="gray" @click="dialog = false">Đóng</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-select v-model="form.category_id" :items="categories" item-title="name" item-value="id" label="Chọn danh mục"></v-select>

    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const products = ref([]);
  const dialog = ref(false);
  const isEditing = ref(false);
  const form = ref({ id: null, name: "", price: "", stock: "", image: "" });
  
  const loadProducts = async () => {
    const { data } = await axios.get("/products");
    products.value = data;
  };
  
  const openDialog = () => {
    form.value = { id: null, name: "", price: "", stock: "", image: "" };
    isEditing.value = false;
    dialog.value = true;
  };
  
  const editProduct = (product) => {
    form.value = { ...product };
    isEditing.value = true;
    dialog.value = true;
  };
  
  const saveProduct = async () => {
    if (isEditing.value) {
      await axios.put(`/products/${form.value.id}`, form.value);
    } else {
      await axios.post("/products", form.value);
    }
    dialog.value = false;
    loadProducts();
  };
  
  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await axios.delete(`/products/${id}`);
      loadProducts();
    }
  };
  
  onMounted(loadProducts);
  definePageMeta({ middleware: "auth" });
  const categories = ref([]);
const loadCategories = async () => {
  const { data } = await axios.get("/categories");
  categories.value = data;
};
onMounted(() => {
  loadCategories();
  loadProducts();
});

  </script>
  