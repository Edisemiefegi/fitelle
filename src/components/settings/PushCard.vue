<template>
  <Card title="Push notifications" description="Get a nudge on this device when an order needs you, even when Fitelle is closed.">
    <div class="mt-4">
      <p v-if="!supported" class="text-xs text-muted-foreground">
        This browser can't receive push notifications. You'll still see every alert inside Fitelle.
      </p>

      <p v-else-if="needsInstall" class="text-xs text-muted-foreground">
        On iPhone, notifications work once Fitelle is added to your home screen. Install it below, open it from your
        home screen, then come back here to turn them on.
      </p>

      <div v-else class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium">This device</p>
          <p class="text-xs text-muted-foreground">
            {{ permission === "denied" ? "Blocked in your browser settings." : "Daily summary of what needs your attention." }}
          </p>
        </div>
        <Switch
          :model-value="isEnabled"
          :disabled="isBusy || permission === 'denied'"
          @update:model-value="$event ? enable() : disable()"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "@/components/base/Card.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import { usePushNotifications } from "@/composables/usePushNotifications";

const { supported, isEnabled, isBusy, needsInstall, permission, enable, disable } = usePushNotifications();
</script>
