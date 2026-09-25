import { customRef, onBeforeUnmount } from "vue";

export function useDebouncedRef<T>(initialValue: T, delay = 300) {
  let value = initialValue;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const ref = customRef<T>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue: T) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newValue;
        trigger();
      }, delay);
    },
  }));

  onBeforeUnmount(() => clearTimeout(timeout));

  return ref;
}