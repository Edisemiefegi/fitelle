<template>
  <main class="space-y-5">
    <Header
      title="Orders"
      button="New order"
      text="The order book"
      subtitle="A clear view of every garment from first conversation to final handover."
    />

    <div class="flex items-center gap-4">
      <Search model-value="" />
      <div class="flex gap-1">
        <Button variant="outline" size="sm"><Calendar /> </Button>
        <Button variant="outline" size="sm"><Download /> </Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/base/Header.vue";
import Search from "@/components/base/Search.vue";
import Button from "@/components/ui/button/Button.vue";
import { Calendar, Download } from "@lucide/vue";
</script>

<style scoped></style>
