<template>
  <PopOver v-model:open="open">
    <template #trigger>
      <Button class="shrink-0">
        <UserPlus class="size-4" />
      </Button>
    </template>

    <div class="w-full space-y-2">
      <div>
        <p class="text-xs font-medium">New customer</p>
        <p class="text-[8px] text-muted-foreground">
          Just the basics — add measurements from their profile later.
        </p>
      </div>

      <CustomerForm :form="form" :errors="errors" />

      <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button variant="outline" size="sm" type="button" @click="open = false">
          Cancel
        </Button>

        <Button
          size="sm"
          type="button"
          :disabled="isSubmitting"
          @click="submit"
        >
          {{ isSubmitting ? "Saving..." : "Save customer" }}
        </Button>
      </div>
    </div>
  </PopOver>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";
import { UserPlus } from "@lucide/vue";
import PopOver from "../base/PopOver.vue";

import Button from "@/components/ui/button/Button.vue";
import { useCustomerStore } from "@/stores/customer";
import { quickCustomerSchema } from "@/schema/order";
import { createEmptyMeasurements } from "@/constants/measurements";
import CustomerForm from "../customer/CustomerForm.vue";

const emit = defineEmits<{
  created: [customerId: string];
}>();

const customerStore = useCustomerStore();

const open = ref(false);
const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});
const form = reactive({ name: "", phone: "" });

async function submit() {
  errors.value = {};
  const result = quickCustomerSchema.safeParse(form);
  if (!result.success) {
    for (const issue of result.error.issues)
      errors.value[issue.path[0] as string] = issue.message;
    return;
  }

  isSubmitting.value = true;
  try {
    const id = await customerStore.addNewCustomer({
      name: result.data.name,
      phone: result.data.phone,
      unit: "in",
      measurements: createEmptyMeasurements(),
      customFields: [],
    } as any);

    toast.success("Customer added");
    emit("created", id);
    form.name = "";
    form.phone = "";
    open.value = false;
  } catch (error) {
    console.error("Quick add customer failed:", error);
    toast.error("Couldn't add the customer. Try again.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
