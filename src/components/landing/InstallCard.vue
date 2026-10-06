<template>
  <div class="mx-auto w-full max-w-sm rounded-3xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
    <!-- Already installed -->
    <div v-if="isStandalone" class="text-center">
      <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check class="size-6" />
      </div>
      <p class="mt-4 font-display text-lg">You're all set</p>
      <p class="mt-1 text-sm text-muted-foreground">Fitelle is already installed on this device.</p>
      <RouterLink
        to="/overview"
        class="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85"
      >
        Open Fitelle
        <ArrowRight class="size-4" />
      </RouterLink>
    </div>

    <!-- Android / desktop with a native install prompt available -->
    <div v-else-if="canInstall" class="text-center">
      <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <Download class="size-5" />
      </div>
      <p class="mt-4 font-display text-lg">Install Fitelle</p>
      <p class="mt-1 text-sm text-muted-foreground">One tap, and it lives on your home screen like any other app.</p>
      <button
        type="button"
        class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85"
        @click="handleInstall"
      >
        <Download class="size-4" />
        Install app
      </button>
    </div>

    <!-- iOS Safari: no install API exists, so show the manual steps -->
    <div v-else-if="platform === 'ios'" class="text-center">
      <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <Smartphone class="size-5" />
      </div>
      <p class="mt-4 font-display text-lg">Add Fitelle to your home screen</p>
      <p class="mt-1 text-sm text-muted-foreground">for Iphone — it only takes three taps.</p>

      <ol class="mt-6 space-y-4 text-left">
        <li class="flex items-start gap-3">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">1</span>
          <p class="text-sm">
            Tap the <Share class="inline size-3.5 -translate-y-0.5" /> <strong>Share</strong> icon in Browser's toolbar.
          </p>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">2</span>
          <p class="text-sm">Scroll down and tap <strong>Add to Home Screen</strong>.</p>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">3</span>
          <p class="text-sm">Tap <strong>Add</strong> — Fitelle now opens full-screen, right from your home screen.</p>
        </li>
      </ol>
    </div>

    <!-- Android, but the browser hasn't offered the native prompt (yet, or unsupported) -->
    <div v-else-if="platform === 'android'" class="text-center">
      <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <Smartphone class="size-5" />
      </div>
      <p class="mt-4 font-display text-lg">Add Fitelle to your home screen</p>
      <ol class="mt-6 space-y-4 text-left">
        <li class="flex items-start gap-3">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">1</span>
          <p class="text-sm">
            Tap <strong>⋮</strong> in the top-right corner of your browser.
          </p>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">2</span>
          <p class="text-sm">Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
        </li>
      </ol>
    </div>

    <!-- Desktop fallback: QR code to continue on a phone -->
    <div v-else class="text-center">
      <p class="font-display text-lg">Get Fitelle on your phone</p>
      <p class="mt-1 text-sm text-muted-foreground">Scan with your phone's camera to open Fitelle and install it there.</p>
      <div class="mt-5 flex justify-center">
        <QrCode :value="currentUrl" :size="160" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, Check, Download, Share, Smartphone } from "@lucide/vue";
import { toast } from "vue-sonner";
import QrCode from "./QrCode.vue";
import { useDevicePlatform } from "@/composables/useDevicePlatform";
import { useInstallPrompt } from "@/composables/useInstallPrompt";

const { platform, isStandalone } = useDevicePlatform();
const { canInstall, promptInstall } = useInstallPrompt();

const currentUrl = computed(() => (typeof window !== "undefined" ? window.location.origin : ""));

async function handleInstall() {
  const outcome = await promptInstall();
  if (outcome === "accepted") toast.success("Installing Fitelle...");
}
</script>