<template>
  <Modal
    save-btn="Record payment"
    :open="open"
    :is-loading="isSubmitting"
    title="Record payment"
    :description="`Remaining balance: ${formatCurrency(order.balance)}`"
    @update:open="handleOpenChange"
    @submit="handleSubmit"
  >
    <div class="space-y-4">
      <Field required label="Amount" :error="errors.amount">
        <MoneyInput v-model="amount" :max="order.balance" />
      </Field>

      <div class="space-y-1">
        <label class="text-sm font-medium"
          >Note
          <span class="font-normal text-muted-foreground"
            >(optional)</span
          ></label
        >
        <FormInput v-model="note" placeholder="e.g. Balance on fitting day" />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import Field from "@/components/base/Field.vue";
import FormInput from "@/components/base/FormInput.vue";
import MoneyInput from "@/components/base/MoneyInput.vue";
import { createPaymentSchema } from "@/schema/order";
import { formatCurrency } from "@/lib";
import { useOrderStore } from "@/stores/order";
import type { OrderType } from "@/types/order";

const props = defineProps<{
  open: boolean;
  order: OrderType;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const orderStore = useOrderStore();
const amount = ref<number | null>(null);
const note = ref("");
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function reset() {
  amount.value = null;
  note.value = "";
  errors.value = {};
}

function handleOpenChange(value: boolean) {
  if (!value) reset();
  emit("update:open", value);
}

async function handleSubmit() {
  errors.value = {};
  const schema = createPaymentSchema(props.order.balance);
  const result = schema.safeParse({ amount: amount.value, note: note.value });
  if (!result.success) {
    for (const issue of result.error.issues)
      errors.value[issue.path[0] as string] = issue.message;
    return;
  }

  isSubmitting.value = true;
  try {
    await orderStore.recordPayment(
      props.order.id,
      result.data.amount,
      result.data.note,
    );
    reset();
    emit("update:open", false);
  } catch {
    // store already surfaced a toast; keep the dialog open so the user can retry
  } finally {
    isSubmitting.value = false;
  }
}
</script>
