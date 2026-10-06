<template>
  <main v-if="authStore.currentUser" class="space-y-6">
    <Header
      title="Settings"
      text="Business profile"
      subtitle="Shape the details your customers see when they follow a piece home."
    />

    <!-- Business Profile -->
    <Card title="Business profile" description="Basic information about your fashion business.">
      <form class="space-y-5" @submit.prevent="handleSave">
        <div class="grid gap-5 md:grid-cols-2">
          <!-- Business name -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Business name</label>
            <Input v-model="form.brandName" placeholder="e.g. Didi Stitches" />
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Phone number</label>
            <Input v-model="form.phoneNumber" placeholder="e.g. 08012345678" />
          </div>
        </div>

        <div class="flex justify-end">
          <Button type="submit" size="sm" :disabled="authStore.isSavingProfile">
            {{ authStore.isSavingProfile ? "Saving..." : "Save changes" }}
          </Button>
        </div>
      </form>
    </Card>

    <!-- Preferences -->
    <Card title="Preferences" description="A few settings for how Fitelle works for you.">
      <div class="divide-y divide-border">
        <!-- Order notifications -->
        <div class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div>
            <p class="text-sm font-medium">Order notifications</p>
            <p class="text-xs text-muted-foreground">Get notified when an order needs your attention.</p>
          </div>
          <Switch v-model:checked="form.notifications" @update:checked="handleSave" />
        </div>
      </div>
    </Card>
  </main>

  <main v-else class="space-y-3">
    <div class="h-8 w-48 animate-pulse rounded bg-muted/60" />
    <div class="h-64 w-full animate-pulse rounded-xl bg-muted/60" />
  </main>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { toast } from "vue-sonner";

import Header from "@/components/base/Header.vue";
import Card from "@/components/base/Card.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const form = reactive({
  brandName: "",
  phoneNumber: "",
  notifications: true,
});

function fillFromUser() {
  const user = authStore.currentUser;
  if (!user) return;
  form.brandName = user.brandName ?? "";
  form.phoneNumber = user.phoneNumber ?? "";
  form.notifications = user.notifications ?? true;
}

// currentUser may already be hydrated (persisted store) or may only land
// once Firebase auth state finishes restoring — handle both.
fillFromUser();
watch(() => authStore.currentUser, fillFromUser);

async function handleSave() {
  try {
    await authStore.updateProfile({ ...form });
    toast.success("Settings saved");
  } catch {
    // the auth store already showed the error toast
  }
}
</script>