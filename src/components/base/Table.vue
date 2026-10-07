<script setup lang="ts">
import { toRef, watch } from "vue";
import Pagination from "@/components/base/Pagination.vue";
import { usePagination } from "@/composables/usePagination";

export interface TableColumn {
  key: string;
  label: string;
  class?: string;
}


const emit = defineEmits<{
  "row-click": [row: any];
}>();


const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    rows: any[];
    loading?: boolean;
    emptyMessage?: string;
    pageSize?: number;
    /** When this changes (e.g. the search text) the table goes back to page 1. */
    resetKey?: unknown;
  }>(),
  { pageSize: 10 },
);

const rowsRef = toRef(props, "rows");
const { page, pageItems, reset } = usePagination(rowsRef, props.pageSize);
watch(() => props.resetKey, reset);
</script>

<template>
  <div class="w-full bg-white overflow-hidden rounded-xl border border-border">
    <div class="w-full overflow-x-auto">
      <table class="w-full  border-collapse text-sm">
        <!-- Header -->
        <thead class="border-b border-border bg-muted/40">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-2  py-3 text-left text-xs font-medium text-muted-foreground',
                column.class,
              ]"
            >
              {{ column.label }}
            </th>

         
          </tr>
        </thead>

        <!-- Loading -->
        <tbody v-if="loading">
          <tr>
            <td
              :colspan="columns.length"
              class="px-4 py-10 text-center text-sm text-muted-foreground"
            >
              Loading...
            </td>
          </tr>
        </tbody>

        <!-- Empty -->
        <tbody v-else-if="!rows.length">
          <tr>
            <td
              :colspan="columns.length"
              class="px-4 py-10 text-center text-sm text-muted-foreground"
            >
              {{ emptyMessage ?? "No data found." }}
            </td>
          </tr>
        </tbody>

        <!-- Rows -->
        <tbody v-else>
          <tr
          @click="emit('row-click', row)"
            v-for="row in pageItems"
            :key="row.id"
            class="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
          >
            <td
            
              v-for="column in columns"
              :key="column.key"
              :class="['px-2 py-3', column.class]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
              >
                {{ row[column.key] }}
              </slot>
            </td>

          
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="rows.length" class="border-t border-border p-3">
      <Pagination v-model="page" :total="rows.length" :page-size="pageSize" />
    </div>
  </div>
</template>
