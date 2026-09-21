<template>
  <div class="w-full">
    <Backdrop />
    <main class="relative ">
      <Navbar />

      <div class="container mx-auto lg:py-30 py-10 px-4 sm:px-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Backdrop from "@/components/base/Backdrop.vue";
import Navbar from "@/components/base/Navbar.vue";
</script>
