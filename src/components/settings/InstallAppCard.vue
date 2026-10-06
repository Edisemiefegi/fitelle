<template>
  <Card v-if="!isStandalone && platform !== 'desktop'" title="Install Fitelle" description="Open it from your home screen like any other app.">
    <div class="mt-4">
      <Button v-if="canInstall" size="sm" @click="handleInstall">
        <Download class="size-4" />
        Install app
      </Button>

      <ol v-else-if="platform === 'ios'" class="space-y-2 text-sm">
        <li>1. Tap the <Share class="inline size-3.5 -translate-y-0.5" /> <strong>Share</strong> icon in Safari.</li>
        <li>2. Tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
      </ol>

      <ol v-else class="space-y-2 text-sm">
        <li>1. Tap <strong>⋮</strong> in your browser's top-right corner.</li>
        <li>2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
      </ol>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Download, Share } from "@lucide/vue";
import { toast } from "vue-sonner";
import Card from "@/components/base/Card.vue";
import Button from "@/components/ui/button/Button.vue";
import { useDevicePlatform } from "@/composables/useDevicePlatform";
import { useInstallPrompt } from "@/composables/useInstallPrompt";

const { platform, isStandalone } = useDevicePlatform();
const { canInstall, promptInstall } = useInstallPrompt();

async function handleInstall() {
  if ((await promptInstall()) === "accepted") toast.success("Installing Fitelle...");
}
</script>
