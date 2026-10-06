<template>
  <main class="space-y-5">
    <Header title="Notifications" text="Needs your attention" :subtitle="headline" />

    <Card>
      <AttentionList v-if="items.length" :items="items" show-detail dismissible @dismiss="dismiss" />
      <div v-else class="py-10 text-center">
        <BellRing class="mx-auto size-6 text-muted-foreground" />
        <p class="mt-3 text-sm font-medium">You're all caught up</p>
        <p class="mt-1 text-xs text-muted-foreground">New alerts show up here as orders change.</p>
      </div>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { BellRing } from "@lucide/vue";
import Card from "@/components/base/Card.vue";
import Header from "@/components/base/Header.vue";
import AttentionList from "@/components/notifications/AttentionList.vue";
import { useAttention } from "@/composables/useAttention";

const { items, headline, dismiss } = useAttention();
</script>
