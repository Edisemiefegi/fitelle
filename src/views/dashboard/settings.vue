<template>
  <main class="space-y-6">
    <Header
      title="Settings"
      text="Business profile"
      subtitle="Shape the details your customers see when they follow a piece home."
    />

    <!-- Business Profile -->
    <Card
      title="Business profile"
      description="Basic information about your fashion business."
    >
      <form
        class="space-y-5"
        @submit.prevent="saveSettings"
      >
        <div class="grid gap-5 md:grid-cols-2">
          <!-- Business name -->
          <div class="space-y-2">
            <label class="text-sm font-medium">
              Business name
            </label>

            <Input
              v-model="form.businessName"
              placeholder="e.g. Didi Stitches"
            />
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label class="text-sm font-medium">
              Phone number
            </label>

            <Input
              v-model="form.phone"
              placeholder="e.g. 08012345678"
            />
          </div>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label class="text-sm font-medium">
            Location
          </label>

          <Input
            v-model="form.location"
            placeholder="e.g. Abuja, Nigeria"
          />
        </div>

        <!-- About -->
        <div class="space-y-2">
          <label class="text-sm font-medium">
            About your business
          </label>

          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Tell your customers a little about your business..."
            class="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            size="sm"
            :disabled="isSaving"
          >
            {{ isSaving ? "Saving..." : "Save changes" }}
          </Button>
        </div>
      </form>
    </Card>

    <!-- Preferences -->
    <Card
      title="Preferences"
      description="A few settings for how Fitelle works for you."
    >
      <div class="divide-y divide-border">
        <!-- Order notifications -->
        <div
          class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div>
            <p class="text-sm font-medium">
              Order notifications
            </p>

            <p class="text-xs text-muted-foreground">
              Get notified when an order needs your attention.
            </p>
          </div>

          <Switch v-model:checked="form.notifications" />
        </div>

        <!-- WhatsApp -->
        <div
          class="flex items-center justify-between gap-4 py-4"
        >
          <div>
            <p class="text-sm font-medium">
              WhatsApp contact
            </p>

            <p class="text-xs text-muted-foreground">
              Allow customers to contact you through WhatsApp.
            </p>
          </div>

          <Switch v-model:checked="form.whatsapp" />
        </div>
      </div>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";

import Header from "@/components/base/Header.vue";
import Card from "@/components/base/Card.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Switch from "@/components/ui/switch/Switch.vue";

const isSaving = ref(false);

const form = reactive({
  businessName: "",
  phone: "",
  location: "",
  description: "",
  notifications: true,
  whatsapp: true,
});

async function saveSettings() {
  isSaving.value = true;

  try {
    // Connect this to Firebase later.
    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    toast.success("Settings saved");
  } catch (error) {
    console.error("Failed to save settings:", error);
    toast.error("Couldn't save your settings.");
  } finally {
    isSaving.value = false;
  }
}
</script>