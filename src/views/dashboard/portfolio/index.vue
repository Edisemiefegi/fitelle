<template>
  <main class="space-y-5">
    <Header
      title="Portfolio"
      button="view public page"
      text="Your best work"
      subtitle="Curate the pieces that make customers say yes."
      @button-click="handlePreview"
    />

    <div v-if="portfolioStore.portfolio" class="space-y-5">
      <Card content-class-name="justify-between flex gap-2 items-center" class="p-2!">
        <div class="min-w-0">
          <p class="text-xs font-medium">Your public portfolio link</p>
          <p class="truncate text-[10px] text-muted-foreground">{{ portfolioStore.publicUrl }}</p>
        </div>
        <Button variant="ghost" size="xs" class="text-primary" @click="handleCopyLink">
          <Copy class="size-3" />
          {{ copied ? "Copied!" : "Copy link" }}
        </Button>
      </Card>

      <Tabs :tabs="tabs" default-value="brand" />
    </div>

    <div v-else-if="portfolioStore.error" class="rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p class="text-sm font-medium">Couldn't load your portfolio</p>
      <p class="mt-1 text-xs text-muted-foreground">{{ portfolioStore.error }}</p>
      <Button class="mt-4" size="sm" variant="outline" @click="portfolioStore.load()">
        <RotateCw class="size-3.5" />
        Try again
      </Button>
    </div>

    <div v-else class="h-40 animate-pulse rounded-2xl bg-muted/60" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Copy, RotateCw } from "@lucide/vue";
import Card from "@/components/base/Card.vue";
import Header from "@/components/base/Header.vue";
import Tabs from "@/components/base/Tabs.vue";
import Button from "@/components/ui/button/Button.vue";
import Brand from "@/components/portfolio/tabs/Brand.vue";
import Design from "@/components/portfolio/tabs/Design.vue";
import Service from "@/components/portfolio/tabs/Service.vue";
import Contact from "@/components/portfolio/tabs/Contact.vue";
import { usePortfolioStore } from "@/stores/portfolio";

const portfolioStore = usePortfolioStore();

const tabs = [
  { value: "brand", label: "Brand", component: Brand },
  { value: "designs", label: "Designs", component: Design },
  { value: "services", label: "Services", component: Service },
  { value: "contact", label: "Contact", component: Contact },
];

const copied = ref(false);

function handlePreview() {
  if (portfolioStore.publicUrl) window.open(portfolioStore.publicUrl, "_blank");
}

async function handleCopyLink() {
  await navigator.clipboard.writeText(portfolioStore.publicUrl);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

onMounted(() => portfolioStore.load());
</script>
