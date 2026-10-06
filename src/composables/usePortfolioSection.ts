import { computed, reactive, ref, watch } from "vue";
import type { ZodType } from "zod";
import { usePortfolioStore } from "@/stores/portfolio";
import type { Portfolio } from "@/types/portfolio";

type Section = Partial<Pick<Portfolio, "brandName" | "tagline" | "introduction" | "about" | "designerBio" | "image" | "services" | "contact">>;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/**
 * Editable copy of one slice of the portfolio (a dashboard tab).
 * `read` picks the fields the tab owns; `schema` validates them before saving.
 */
export function usePortfolioSection<T extends Section>(read: (p: Portfolio) => T, schema: ZodType) {
  const store = usePortfolioStore();

  const form = reactive({} as T);
  const errors = ref<Record<string, string>>({});

  watch(
    () => store.portfolio,
    (portfolio) => portfolio && Object.assign(form, clone(read(portfolio))),
    { immediate: true },
  );

  async function save() {
    const result = schema.safeParse(form);
    errors.value = {};

    if (!result.success) {
      for (const issue of result.error.issues) errors.value[issue.path.join(".")] ??= issue.message;
      return;
    }

    await store.saveProfile(result.data as T).catch(() => {});
  }

  return { form, errors, isSaving: computed(() => store.isSaving), save };
}
