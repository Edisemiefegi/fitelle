<template>
  <!-- Help & Support -->
  <Card
    title="Help & Support"
    description="Something not working? Let us know and we'll look into it."
  >
    <form class="space-y-4" @submit.prevent="submitSupport">
      <div class="space-y-2">
        <label class="text-sm font-medium">What can we help with?</label>

        <Select
          v-model="supportForm.type"
          :options="selectOptions"
          placeholder="Select support type"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Tell us what happened</label>
        <textarea
          v-model="supportForm.message"
          required
          minlength="10"
          maxlength="3000"
          rows="4"
          placeholder="Describe the issue or tell us how we can improve Fitelle..."
          class="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <p class="text-xs text-muted-foreground text-right">
          {{ supportForm.message.length }}/3000
        </p>
      </div>

      <div class="flex justify-end">
        <Button
          type="submit"
          size="sm"
          :disabled="
            isSubmittingSupport || supportForm.message.trim().length < 10
          "
        >
          {{ isSubmittingSupport ? "Sending..." : "Send report" }}
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Card from "../base/Card.vue";
import Select from "../base/Select.vue";

import Button from "../ui/button/Button.vue";
import { useAuthStore } from "@/stores/auth.ts";
import { addDoc, collection, db } from "@/service/firebase.ts";
import { toast } from "vue-sonner";

const isSubmittingSupport = ref(false);
const authStore = useAuthStore();

const supportForm = reactive({
  type: "bug" as "bug" | "complaint" | "feedback",
  message: "",
});

const selectOptions = [
  { value: "bug", label: "Report a bug" },
  { value: "complaint", label: "Make a complaint" },
  { value: "feedback", label: "Share feedback" },
];

async function submitSupport() {
  const user = authStore.currentUser;
  const message = supportForm.message.trim();

  if (!user || message.length < 10) {
    toast.error("Please describe the issue in at least 10 characters.");
    return;
  }

  if (isSubmittingSupport.value) return;

  isSubmittingSupport.value = true;

  try {
    await addDoc(collection(db, "supportReports"), {
      userId: user.id,
      userEmail: user.email ?? "",
      brandName: user.brandName ?? "",
      type: supportForm.type,
      message,
      status: "open",
      createdAt: new Date().toISOString(),
    });

    supportForm.message = "";
    supportForm.type = "bug";

    toast.success("Report sent. Thank you for letting us know!");
  } catch (error) {
    console.error("Support submission error:", error);
    toast.error("Couldn't send your report. Please try again.");
  } finally {
    isSubmittingSupport.value = false;
  }
}
</script>

<style scoped></style>
