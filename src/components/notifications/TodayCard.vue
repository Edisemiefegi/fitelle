<template>
  <Card title="Today" :description="headline">
    <div class="mt-4">
      <AttentionList v-if="items.length" :items="preview" />
      <p v-else class="text-sm text-muted-foreground">Nothing is due, late or waiting on you right now.</p>

      <RouterLink
        v-if="items.length > PREVIEW_LIMIT"
        to="/notifications"
        class="mt-4 inline-block text-xs font-medium text-primary hover:underline"
      >
        See all {{ items.length }}
      </RouterLink>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/base/Card.vue";
import AttentionList from "./AttentionList.vue";
import { useAttention } from "@/composables/useAttention";

const PREVIEW_LIMIT = 5;

const { items, headline } = useAttention();
const preview = computed(() => items.value.slice(0, PREVIEW_LIMIT));
</script>
