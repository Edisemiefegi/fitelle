import { computed } from "vue";
import { useNow } from "@vueuse/core";

/** "Good morning" / "Good afternoon" / "Good evening" for the user's local time; updates as the day moves on. */
export function useGreeting() {
  const now = useNow({ interval: 60_000 });

  return computed(() => {
    const hour = now.value.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  });
}
