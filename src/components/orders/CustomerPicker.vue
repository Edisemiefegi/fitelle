<template>
  <section class="space-y-4">
    <SectionLabel title="Customer" description="Who is this order for?" />

    <div class="flex gap-2">
      <Select
        is-search
        class="flex-1"
        :model-value="modelValue"
        :options="customerOptions"
        placeholder="Select customer"
        search-placeholder="Search customers..."
        empty-text="No customers found"
        required
        @update:model-value="emit('update:modelValue', $event)"
      />

      <NewCustomerPopover @created="handleCreated" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Select from "@/components/base/Select.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import NewCustomerPopover from "./NewCustomerPopover.vue";
import { useCustomerStore } from "@/stores/customer";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [customerId: string];
}>();

const customerStore = useCustomerStore();

const customerOptions = computed(() =>
  customerStore.customers.map((customer) => ({ label: customer.name, value: customer.id })),
);

function handleCreated(customerId: string) {
  emit("update:modelValue", customerId);
}
</script>