<template>
    <v-container>
      <h1 class="text-h4 mb-4">Quản lý Danh mục</h1>
      
      <v-text-field v-model="newCategory" label="Tên danh mục"></v-text-field>
      <v-btn color="green" @click="addCategory()">Thêm danh mục</v-btn>
  
      <v-table class="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>
              <v-btn color="red" @click="deleteCategory(category.id)">Xóa</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const categories = ref([]);
  const newCategory = ref("");
  
  const loadCategories = async () => {
    const { data } = await axios.get("/categories");
    categories.value = data;
  };
  
  const addCategory = async () => {
    if (!newCategory.value) return;
    await axios.post("/categories", { name: newCategory.value });
    newCategory.value = "";
    loadCategories();
  };
  
  const deleteCategory = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
      await axios.delete(`/categories/${id}`);
      loadCategories();
    }
  };
  
  onMounted(loadCategories);
  </script>
  