<template>
  <Modal
    :save-btn="isEditing ? 'Update order' : 'Save order'"
    full-screen-mobile
    :open="open"
    :is-loading="isSubmitting"
    :title="isEditing ? 'Edit order' : 'Add order'"
    description="Capture the brief now."
    @update:open="emit('update:open', $event)"
    @submit="handleSubmit"
  >
    <div class="space-y-8">
      <CustomerPicker
        :model-value="form.customerId"
        @update:model-value="setCustomer"
      />

      <div class="h-px bg-border" />

      <OrderDetailsSection :form="form" :errors="errors" />

      <div class="h-px bg-border" />

      <RequirementsChecklist
        :requirements="form.requirements"
        @add="addRequirement"
        @remove="removeRequirement"
        @toggle="toggleRequirement"
      />

      <div class="h-px bg-border" />

      <FabricSourceToggle :form="form" />

      <div class="h-px bg-border" />

      <section class="space-y-4">
        <SectionLabel
          title="Design reference"
          description="Add an image or reference that helps communicate the design."
        />
        <ImageUploader
          :items="referenceUpload.items.value"
          label="Add reference images"
          @add-files="referenceUpload.addFiles"
          @remove="referenceUpload.remove"
        />
      </section>

      <div class="h-px bg-border" />

      <PaymentSection
        :form="form"
        :errors="errors"
        :is-editing="isEditing"
        :existing-paid="order?.paid ?? 0"
      />

      <div class="h-px bg-border" />

      <MeasurementsSection
        :form="form"
        :has-customer="Boolean(selectedCustomer)"
        :customer-name="selectedCustomer?.name"
        @use-defaults="useCustomerDefaults"
        @use-order-specific="useOrderSpecificMeasurements"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import Modal from "@/components/base/Modal.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import ImageUploader from "@/components/base/ImageUploader.vue";
import CustomerPicker from "./CustomerPicker.vue";
import RequirementsChecklist from "./RequirementsChecklist.vue";
import FabricSourceToggle from "./FabricSourceToggle.vue";
import PaymentSection from "./PaymentSection.vue";
import MeasurementsSection from "./MeasurementsSection.vue";
import { useOrderForm } from "@/composables/useOrderForm";
import { useImageUpload } from "@/composables/useImageUpload";
import type { OrderType } from "@/types/order";
import OrderDetailsSection from "./OrderDetailsSection.vue";

const props = defineProps<{
  open: boolean;
  order?: OrderType | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  saved: [orderId: string];
}>();

const {
  form,
  errors,
  isSubmitting,
  isEditing,
  selectedCustomer,
  setCustomer,
  useCustomerDefaults,
  useOrderSpecificMeasurements,
  addRequirement,
  removeRequirement,
  toggleRequirement,
  submit,
} = useOrderForm(props.order);

const referenceUpload = useImageUpload(props.order?.referenceImages ?? []);

async function handleSubmit() {
  if (referenceUpload.isUploading()) {
    toast.error("Wait for images to finish uploading before saving.");
    return;
  }

  const id = await submit(referenceUpload.toOrderImages());
  if (id) {
    emit("saved", id);
    emit("update:open", false);
  }
}
</script>
