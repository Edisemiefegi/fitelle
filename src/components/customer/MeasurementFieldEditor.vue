<template>
  <div class="space-y-6">
    <div v-for="group in groups" :key="group.category" class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-primary" />
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {{ group.title }}
        </p>
      </div>

      <div v-if="group.fields.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MeasurementInput
          v-for="field in group.fields"
          :key="field.key"
          :model-value="modelValue[field.key] ?? null"
          :label="field.label"
          :unit="unit"
          removable
          @update:model-value="(val) => updateValue(field.key, val)"
          @remove="() => removeField(field.key)"
        />
      </div>

      <p v-else class="text-xs text-muted-foreground">
        No {{ group.title.toLowerCase() }} fields.
      </p>
    </div>

    <!-- Add a custom field -->
    <div class="space-y-2 rounded-xl border border-dashed border-border p-3">
      <p class="text-xs font-medium text-muted-foreground">Add your own field</p>

      <div class="flex flex-col gap-2 sm:flex-row">
        <input
          v-model="newFieldLabel"
          type="text"
          placeholder="e.g. Bicep, Rise, Cuff"
          class="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          @keyup.enter="addField"
        />

        <Button type="button" size="sm" variant="outline" @click="addField">
          <Plus class="size-4" />
          Add field
        </Button>
      </div>

      <p v-if="fieldError" class="text-xs text-destructive">{{ fieldError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus } from "@lucide/vue";
import MeasurementInput from "./MeasurementInput.vue";
import Button from "@/components/ui/button/Button.vue";
import type { MeasurementField, Unit } from "@/types/customer";
import {
  DEFAULT_MEASUREMENT_FIELDS,
  generateUniqueFieldKey,
  resolveMeasurementFields,
} from "@/constants/measurements";
import { newFieldLabelSchema } from "@/schema";

const props = defineProps<{
  modelValue: Record<string, number | null>;
  customFields: MeasurementField[];
  unit: Unit;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, number | null>];
  "update:customFields": [value: MeasurementField[]];
}>();

const newFieldLabel = ref("");
const fieldError = ref("");

const allFields = computed(() =>
  resolveMeasurementFields({
    measurements: props.modelValue,
    customFields: props.customFields,
  }),
);

console.log(props.modelValue, 'cusuo');


const groups = computed(() => [
  {
    category: "upper",
    title: "Upper body",
    fields: allFields.value.filter((f) => f.category === "upper"),
  },
  {
    category: "lower",
    title: "Lower body",
    fields: allFields.value.filter((f) => f.category === "lower"),
  },
  {
    category: "custom",
    title: "Custom",
    fields: allFields.value.filter((f) => f.category === "custom"),
  },
]);

function updateValue(key: string, value: number | null) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

function removeField(key: string) {
  const { [key]: _removed, ...rest } = props.modelValue;
  emit("update:modelValue", rest);
  emit(
    "update:customFields",
    props.customFields.filter((f) => f.key !== key),
  );
}

function addField() {
  fieldError.value = "";
  const result = newFieldLabelSchema.safeParse(newFieldLabel.value);
  if (!result.success) {
    fieldError.value = result.error.issues[0].message;
    return;
  }

  const label = result.data;
  const existingKeys = [
    ...Object.keys(props.modelValue),
    ...DEFAULT_MEASUREMENT_FIELDS.map((f) => f.key),
  ];
  const key = generateUniqueFieldKey(label, existingKeys);

  emit("update:modelValue", { ...props.modelValue, [key]: null });
  emit("update:customFields", [
    ...props.customFields,
    { key, label, category: "custom" as const, isCustom: true },
  ]);

  newFieldLabel.value = "";
}
</script>
