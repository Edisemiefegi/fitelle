<template>
  <div v-if="client" class="space-y-6">
    <Header :title="client.name" text="Client Profile" :subtitle="client.phone" button="New order">
      <Button size="sm" variant="outline">
        <MessageCircleCheck />
        WhatsApp
      </Button>

      <Button size="sm" variant="outline" @click="editModalOpen = true">
        <Pencil />
        Edit client
      </Button>
    </Header>

    <Modal
      v-model:open="editModalOpen"
      title="Edit customer"
      description="Update this customer's details."
    >
      <AddCustomer :customer="client" @cancel="editModalOpen = false" @saved="editModalOpen = false" />
    </Modal>

    <Card class="space-y-6"
    title="Measurements"
    :description="`Last updated ${ client.updatedAt ? formatDate(client.updatedAt) : EMPTY_TEXT }`"
    >

      <template #left>
        <div class="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <Ruler class="size-4 text-primary" />
          </div>
      </template>

        <template #right>
        <div class="flex items-start justify-between gap-4">
     

        <!-- View mode -->
        <Button v-if="!editingMeasurements" size="sm" variant="ghost" @click="startEditingMeasurements">
          <Edit class="size-4" />
          Edit
        </Button>

        <!-- Edit mode -->
        <div v-else class="flex items-center gap-2">
          <Button size="sm" variant="ghost" :disabled="savingMeasurements" @click="cancelMeasurementEdit">
            Cancel
          </Button>

          <Button size="sm" :disabled="savingMeasurements" @click="saveMeasurements">
            {{ savingMeasurements ? "Saving..." : "Save" }}
          </Button>
        </div>
      </div>
      </template>

     

      <!-- View mode content -->
      <template v-if="!editingMeasurements">
        <div v-if="hasMeasurements" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="field in visibleFields"
            :key="field.key"
            class="rounded-xl border border-border bg-background p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-medium">{{ field.label }}</p>
              <span class="text-[10px] text-muted-foreground">{{ client.unit }}</span>
            </div>

            <p class="text-xl font-semibold">
              {{ client.measurements[field.key] ?? "—" }}
              <span
                v-if="client.measurements[field.key] != null"
                class="text-xs font-normal text-muted-foreground"
              >
                {{ client.unit }}
              </span>
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <Ruler class="mx-auto mb-3 size-8 text-muted-foreground" />
          <p class="text-sm font-medium">No measurements yet</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Add this client's measurements to make future orders easier.
          </p>
          <Button class="mt-4" size="sm" @click="startEditingMeasurements">Add measurements</Button>
        </div>
      </template>

      <!-- Edit mode: shared field editor handles per-field add/delete -->
      <MeasurementFieldEditor
        v-else
        v-model="editableMeasurements"
        v-model:custom-fields="editableCustomFields"
        :unit="client.unit"
      />
    </Card>

    <Card class="space-y-4">
      <div>
        <p class="text-xs text-muted-foreground">
          Total orders <span class="font-semibold text-sm">{{  0 }}</span>
        </p>
        <h2 class="font-display text-lg font-semibold">Notes</h2>
        <p class="text-xs text-muted-foreground">
          Extra details that may be useful when making this client's clothes.
        </p>
      </div>

      <textarea
        v-model="notes"
        rows="3"
        placeholder="e.g. Prefers a slightly loose fit around the waist..."
        class="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

      <div class="flex justify-end">
        <Button size="sm" variant="outline" :disabled="savingNotes" @click="saveNotes">
          {{ savingNotes ? "Saving..." : "Save note" }}
        </Button>
      </div>
    </Card>
  </div>

  <div v-else class="py-20 text-center text-sm text-muted-foreground">Loading client...</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Edit, MessageCircleCheck, Pencil, Ruler } from "@lucide/vue";

import Card from "@/components/base/Card.vue";
import Header from "@/components/base/Header.vue";
import Modal from "@/components/base/Modal.vue";
import Button from "@/components/ui/button/Button.vue";
import AddCustomer from "@/components/customer/AddCustomer.vue";
import MeasurementFieldEditor from "@/components/customer/MeasurementFieldEditor.vue";
import { useCustomerStore } from "@/stores/customer";
import { resolveMeasurementFields } from "@/constants/measurements";
import type { CustomerType, MeasurementField } from "@/types/customer";
import { EMPTY_TEXT } from "@/constants";

const route = useRoute();
const store = useCustomerStore();

const client = ref<CustomerType | null>(store.getCustomerById(route.params.id as string));

onMounted(async () => {
  if (!client.value) {
    client.value = await store.fetchCustomer(route.params.id as string);
  }
});

const editModalOpen = ref(false);
const editingMeasurements = ref(false);
const savingMeasurements = ref(false);
const savingNotes = ref(false);

const editableMeasurements = ref<Record<string, number | null>>({});
const editableCustomFields = ref<MeasurementField[]>([]);
const notes = ref("");

watch(
  client,
  (value) => {
    if (value) notes.value = value.notes ?? "";
  },
  { immediate: true },
);

const visibleFields = computed(() => (client.value ? resolveMeasurementFields(client.value) : []));

const hasMeasurements = computed(() =>
  visibleFields.value.some((field) => client.value?.measurements[field.key] != null),
);

function startEditingMeasurements() {
  if (!client.value) return;

  console.log(client.value, 'sjsj');
  
  editableMeasurements.value = { ...client.value.measurements };
  editableCustomFields.value = [...client.value.customFields];
  editingMeasurements.value = true;
}

function cancelMeasurementEdit() {
  editingMeasurements.value = false;
}

async function saveMeasurements() {
  if (!client.value) return;
  savingMeasurements.value = true;
  try {
    await store.updateCustomer(client.value.id, {
      measurements: editableMeasurements.value,
      customFields: editableCustomFields.value,
    });
    client.value = store.getCustomerById(client.value.id);
    editingMeasurements.value = false;
  } finally {
    savingMeasurements.value = false;
  }
}

async function saveNotes() {
  if (!client.value) return;
  savingNotes.value = true;
  try {
    await store.updateCustomer(client.value.id, { notes: notes.value });
    client.value = store.getCustomerById(client.value.id);
  } finally {
    savingNotes.value = false;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
