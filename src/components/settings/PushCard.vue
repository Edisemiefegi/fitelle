<template>
  <Card title="Push notifications" description="Get notified on this device the moment something needs your attention, even when Fitelle is closed.">
    <div class="mt-4 flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-medium">Push notifications</p>
        <p class="text-xs text-muted-foreground">{{ hint }}</p>
      </div>

      <Switch :model-value="isEnabled" :disabled="!canToggle" @update:model-value="$event ? enable() : disable()" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/base/Card.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import { usePushNotifications } from "@/composables/usePushNotifications";

const { supported, isEnabled, isBusy, needsInstall, permission, enable, disable } = usePushNotifications();

const canToggle = computed(() => supported.value && !needsInstall.value && !isBusy.value && permission.value !== "denied");

const hint = computed(() => {
  if (needsInstall.value) return "On iPhone, add Fitelle to your home screen and open it from there to turn this on.";
  if (!supported.value) return "Not available in this browser. You'll still see every alert inside Fitelle.";
  if (permission.value === "denied") return "Blocked in your browser settings. Allow notifications for this site, then come back.";
  return isEnabled.value ? "On. You'll be notified when an order is due soon, overdue, missing details or waiting on payment." : "Off for this device.";
});
</script>
