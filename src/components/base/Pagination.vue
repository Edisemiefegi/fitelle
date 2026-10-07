<template>
  <nav v-if="total > 0" class="flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Pagination">
    <p class="text-xs text-muted-foreground">Showing {{ from }}–{{ to }} of {{ total }}</p>

    <div class="flex items-center gap-1">
      <Button variant="outline" size="icon" :disabled="page <= 1" aria-label="Previous page" @click="go(page - 1)">
        <ChevronLeft class="size-4" />
      </Button>

      <template v-for="(item, i) in items" :key="i">
        <span v-if="item === null" class="px-1 text-xs text-muted-foreground">…</span>
        <Button
          v-else
          size="icon"
          :variant="item === page ? 'default' : 'ghost'"
          class="text-xs"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </Button>
      </template>

      <Button variant="outline" size="icon" :disabled="page >= pageCount" aria-label="Next page" @click="go(page + 1)">
        <ChevronRight class="size-4" />
      </Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import Button from "@/components/ui/button/Button.vue";

const props = defineProps<{ total: number; pageSize: number }>();

const page = defineModel<number>({ default: 1 });

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const from = computed(() => (page.value - 1) * props.pageSize + 1);
const to = computed(() => Math.min(page.value * props.pageSize, props.total));

/** First, last and the pages around the current one; null marks a gap. */
const items = computed<(number | null)[]>(() => {
  const last = pageCount.value;
  const wanted = new Set([1, last, page.value - 1, page.value, page.value + 1].filter((n) => n >= 1 && n <= last));
  const sorted = [...wanted].sort((a, b) => a - b);

  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? [null, n] : [n]));
});

function go(next: number) {
  page.value = Math.min(Math.max(1, next), pageCount.value);
}
</script>
