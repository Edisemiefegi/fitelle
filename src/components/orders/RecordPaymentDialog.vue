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
        <div class="relative">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            >₦</span
          >
          <input
            v-model.number="amount"
            type="number"
            min="0"
            :max="order.balance"
            placeholder="0.00"
            class="h-11 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </Field>

      <div class="space-y-1">
        <label class="text-sm font-medium"
          >Note
          <span class="font-normal text-muted-foreground"
            >(optional)</span
          ></label
        >
        <input
          v-model="note"
          type="text"
          placeholder="e.g. Balance on fitting day"
          class="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import Field from "@/components/base/Field.vue";
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
