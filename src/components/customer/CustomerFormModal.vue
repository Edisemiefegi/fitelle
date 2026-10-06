<template>
  <Modal
    :save-btn="isEditing ? 'Update customer' : 'Save customer'"
    full-screen-mobile
    :open="modalOpen"
    @update:open="emit('update:modal-open', $event)"
    @submit="handleSubmit"
    :title="isEditing ? 'Edit customer' : 'Add customer'"
    :description="
      isEditing
        ? 'Update your customer’s details.'
        : 'Add a new customer to your client book.'
    "
    :is-loading="isLoading"
  >
    <div class="space-y-8">
      <section class="space-y-4">
        <SectionLabel
          title="  Customer details"
          description=" Basic information about your customer."
        />
        <CustomerForm show :form="form" errors="" />
      </section>

      <div class="h-px bg-border" />

      <section v-if="showMeasurement" class="space-y-4">
        <div
          class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
        >
          <SectionLabel
            title=" Measurements"
            description="    Add the customer's measurements for future orders."
          />

          <!-- Unit selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground"> Unit </span>

            <div class="flex rounded-lg border border-border bg-muted/30 p-1">
              <Button
                v-for="option in units"
                :key="option.value"
                size="xs"
                variant="ghost"
                :class="
                  form.unit === option.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground'
                "
                @click="form.unit = option.value"
              >
                {{ option.label }}
              </Button>
            </div>
          </div>
        </div>

        <MeasurementFieldEditor
          v-model="form.measurements"
          v-model:custom-fields="form.customFields"
          :unit="form.unit"
        />
      </section>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/base/Modal.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import CustomerForm from "./CustomerForm.vue";
import MeasurementFieldEditor from "./MeasurementFieldEditor.vue";
import { computed, reactive, ref } from "vue";
import type { CustomerType, Unit } from "@/types/customer.ts";
import { customerSchema } from "@/schema/index.ts";
import { useCustomerStore } from "@/stores/customer.ts";
import { createEmptyMeasurements } from "@/constants/measurements.ts";
import Button from "../ui/button/Button.vue";

const { addNewCustomer, updateCustomer } = useCustomerStore();

const props = withDefaults(
  defineProps<{
    customer?: CustomerType | null;
    modalOpen: boolean;
    showMeasurement?: boolean;
  }>(),
  { showMeasurement: true },
);

const emit = defineEmits<{
  "update:modal-open": [value: boolean];
  saved: [id: string];
}>();

const isEditing = computed(() => Boolean(props.customer?.id));
const isLoading = ref(false);
const errors = ref<Record<string, string[]>>({});

const form = reactive<CustomerType>({
  id: props.customer?.id ?? "",
  name: props.customer?.name ?? "",
  phone: props.customer?.phone ?? "",
  notes: props.customer?.notes ?? "",
  unit: props.customer?.unit ?? "in",
  measurements: props.customer?.measurements
    ? { ...props.customer.measurements }
    : createEmptyMeasurements(),
  customFields: props.customer?.customFields
    ? [...props.customer.customFields]
    : [],
});

const units = [
  {
    label: "in",
    value: "in" as Unit,
  },
  {
    label: "cm",
    value: "cm" as Unit,
  },
];

const handleSubmit = async () => {
  errors.value = {};

  const result: any = customerSchema.safeParse(form);
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors;
    return;
  }

  isLoading.value = true;
  try {
    if (isEditing.value) {
      await updateCustomer(form.id, result.data);
      emit("saved", form.id);
    } else {
      const id = await addNewCustomer(result.data);
      emit("saved", id);
    }
  } catch (error) {
    console.error("Failed to save customer:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
