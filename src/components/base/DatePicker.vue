<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :disabled="disabled"
        :class="
          cn(
            'flex h-11 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 text-left text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50',
            !model && 'text-muted-foreground/70',
            props.class,
          )
        "
      >
        <CalendarDays class="size-4 shrink-0 text-muted-foreground" />
        <span class="flex-1 truncate">{{ label }}</span>
        <span
          v-if="model && clearable"
          role="button"
          tabindex="-1"
          aria-label="Clear date"
          class="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          @click.stop="model = null"
        >
          <X class="size-3.5" />
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent align="start" class="w-72 rounded-2xl p-3">
      <!-- Month navigation -->
      <div class="mb-2 flex items-center justify-between">
        <button type="button" class="rounded-full p-1.5 hover:bg-muted" aria-label="Previous month" @click="shiftMonth(-1)">
          <ChevronLeft class="size-4" />
        </button>
        <p class="text-sm font-medium">{{ monthLabel }}</p>
        <button type="button" class="rounded-full p-1.5 hover:bg-muted" aria-label="Next month" @click="shiftMonth(1)">
          <ChevronRight class="size-4" />
        </button>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 text-center text-[10px] uppercase text-muted-foreground">
        <span v-for="day in WEEKDAYS" :key="day" class="py-1">{{ day }}</span>
      </div>
      <div class="grid grid-cols-7 gap-y-0.5">
        <button
          v-for="cell in cells"
          :key="cell.key"
          type="button"
          :disabled="cell.disabled"
          class="mx-auto flex size-9 items-center justify-center rounded-full text-xs transition disabled:cursor-not-allowed disabled:opacity-30"
          :class="[
            cell.key === model ? 'bg-primary font-medium text-primary-foreground' : 'hover:bg-muted',
            cell.key !== model && cell.isToday && 'font-semibold text-primary ring-1 ring-primary/40',
            !cell.inMonth && cell.key !== model && 'text-muted-foreground/50',
          ]"
          @click="select(cell.key)"
        >
          {{ cell.day }}
        </button>
      </div>

      <div class="mt-2 flex items-center justify-between border-t border-border pt-2">
        <button type="button" class="rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5" @click="select(todayKey())">Today</button>
        <button v-if="clearable" type="button" class="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted" @click="select(null)">Clear</button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from "vue";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "@lucide/vue";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { parseDateKey, todayKey, toDateKey } from "@/lib/date";

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    min?: string | null; // earliest selectable day, "YYYY-MM-DD"
    max?: string | null; // latest selectable day
    clearable?: boolean;
    disabled?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { placeholder: "Pick a date", min: null, max: null, clearable: true, disabled: false },
);

const model = defineModel<string | null>({ default: null });

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const open = ref(false);
// first day of the month being viewed
const viewing = ref(startOfMonth(model.value ? parseDateKey(model.value) : new Date()));

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Re-centre the calendar on the selected day each time it opens or the value changes.
watch([open, model], () => {
  if (open.value) viewing.value = startOfMonth(model.value ? parseDateKey(model.value) : new Date());
});

const label = computed(() =>
  model.value
    ? parseDateKey(model.value).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : props.placeholder,
);

const monthLabel = computed(() => viewing.value.toLocaleDateString("en-NG", { month: "long", year: "numeric" }));

const cells = computed(() => {
  const first = viewing.value;
  const mondayOffset = (first.getDay() + 6) % 7; // weeks start on Monday
  const today = todayKey();

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(first.getFullYear(), first.getMonth(), 1 - mondayOffset + i);
    const key = toDateKey(date);
    return {
      key,
      day: date.getDate(),
      inMonth: date.getMonth() === first.getMonth(),
      isToday: key === today,
      disabled: Boolean((props.min && key < props.min) || (props.max && key > props.max)),
    };
  });
});

function shiftMonth(by: number) {
  viewing.value = new Date(viewing.value.getFullYear(), viewing.value.getMonth() + by, 1);
}

function select(key: string | null) {
  if (key && ((props.min && key < props.min) || (props.max && key > props.max))) return;
  model.value = key;
  open.value = false;
}
</script>
