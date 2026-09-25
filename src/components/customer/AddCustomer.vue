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
    <form class="flex h-full flex-col" @submit.prevent="handleSubmit">
      <div class="flex-1 space-y-8 overflow-y-auto pr-1">
        <section class="space-y-4">
          <SectionLabel
            title="  Customer details"
            description=" Basic information about your customer."
          />

          <div class="space-y-4">
            <Field required :error="errors.name?.[0]" label="Fullname">
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="e.g. Amaka Okafor"
                class="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </Field>

            <Field required :error="errors.phone?.[0]" label="Phone number">
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="e.g. 0803 456 7890"
                class="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </Field>

            <div class="space-y-2">
              <label for="notes" class="text-sm font-medium">
                Notes
                <span class="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>

              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                placeholder="Anything worth remembering about this customer..."
                class="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </section>

        <div class="h-px bg-border" />

        <!-- Measurements -->
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
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import Field from "../base/Field.vue";
import type { CustomerType, Unit } from "@/types/customer.ts";
import { customerSchema } from "@/schema/index.ts";
import { useCustomerStore } from "@/stores/customer.ts";
import MeasurementFieldEditor from "./MeasurementFieldEditor.vue";
import { createEmptyMeasurements } from "@/constants/measurements.ts";
import Modal from "../base/Modal.vue";
import SectionLabel from "../orders/SectionLabel.vue";

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
