<script setup lang="ts">

export interface TableColumn {
  key: string;
  label: string;
  class?: string;
}



defineProps<{
  columns: TableColumn[];
  rows: any[];
  loading?: boolean;
  emptyMessage?: string;
}>();
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
            v-for="row in rows"
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
  </div>
</template>
```
