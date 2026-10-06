<script setup lang="ts">
import { RouterView } from "vue-router";
import { Toaster } from "vue-sonner";
</script>

<template>
  <Toaster rich-colors close-button position="top-center" />
  <RouterView />
</template>
