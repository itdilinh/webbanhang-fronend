<template>
  <v-app>
    <NavBar />
    <v-main>
      <slot />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
</script>
