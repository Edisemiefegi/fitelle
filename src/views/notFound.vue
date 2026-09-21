<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/ui/button/Button.vue";

const router = useRouter();

const goHome = () => {
  router.push("/login");
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center px-6 bg-background"
  >
    <div class="w-full max-w-lg text-center">
      <p class="text-sm font-medium text-muted-foreground mb-4">404</p>

      <h1 class="text-4xl font-semibold tracking-tight mb-4">
        Looks like this page got misplaced.
      </h1>

      <p class="text-muted-foreground mb-8">
        The page you're looking for doesn't exist or may have moved.
      </p>

      <div class="flex items-center justify-center gap-3">
        <Button variant="outline" @click="goBack"> Go back </Button>

        <Button @click="goHome"> Back to home </Button>
      </div>
    </div>
  </main>
</template>
