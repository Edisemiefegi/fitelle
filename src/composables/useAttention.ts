import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { getAttentionItems, attentionHeadline, type AttentionItem } from "@/lib/attention";
import { useOrderStore } from "@/stores/order";

const todayKey = () => new Date().toISOString().slice(0, 10);

// id -> the day it was dismissed. A dismissed alert comes back the next day if it still applies.
const dismissed = useStorage<Record<string, string>>("fitelle:dismissed-alerts", {});

/** Alerts derived live from the orders in the store; nothing is stored server-side. */
export function useAttention() {
  const orderStore = useOrderStore();

  const items = computed<AttentionItem[]>(() => {
    const today = todayKey();
    return getAttentionItems(orderStore.orders).filter((item) => dismissed.value[item.id] !== today);
  });

  const count = computed(() => items.value.length);
  const headline = computed(() => attentionHeadline(count.value));

  function dismiss(id: string) {
    const today = todayKey();
    // keep the map small: forget anything dismissed on earlier days
    const current = Object.fromEntries(Object.entries(dismissed.value).filter(([, day]) => day === today));
    dismissed.value = { ...current, [id]: today };
  }

  return { items, count, headline, dismiss };
}
