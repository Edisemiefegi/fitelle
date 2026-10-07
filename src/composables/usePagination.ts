import { computed, ref, watch, type Ref } from "vue";

/** Splits a list into pages. The page is kept in range when the list shrinks (filters, deletes). */
export function usePagination<T>(items: Ref<T[]>, pageSize = 10) {
  const page = ref(1);

  const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)));
  const pageItems = computed(() => items.value.slice((page.value - 1) * pageSize, page.value * pageSize));

  watch(pageCount, (count) => {
    if (page.value > count) page.value = count;
  });

  function reset() {
    page.value = 1;
  }

  return { page, pageCount, pageItems, pageSize, total: computed(() => items.value.length), reset };
}
