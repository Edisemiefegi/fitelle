<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Component } from "vue";

interface Tab {
  value: string;
  label: string;
  component: Component;
  disabled?: boolean;
}

defineProps<{
  tabs: Tab[];
  defaultValue?: string;
}>();
</script>

<template>
  <Tabs :default-value="defaultValue">
    <TabsList class="w-full overflow-x-auto justify-start border-b bg-transparent">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        class="mt-2 border-b-2  data-[state=active]:border-primary "
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value">
      <component :is="tab.component" />
    </TabsContent>
  </Tabs>
</template>
