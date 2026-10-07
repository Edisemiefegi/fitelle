import { computed, onMounted, ref } from "vue";
import { getPortfolioBySlug, getPublishedWork, listPublishedWorks } from "@/service/portfolio";
import type { Portfolio, PortfolioWork } from "@/types/portfolio";
import { DEMO_SLUG, demoPortfolio, demoWorks } from "@/demo/portfolio"; // DEMO: remove with src/demo

/** Public page data: the business and its published works. */
export function usePublicPortfolio(slug: string) {
  const portfolio = ref<Portfolio | null>(null);
  const works = ref<PortfolioWork[]>([]);
  const isLoading = ref(true);

  // The piece shown full-screen at the top: the one the owner picked, else the latest.
  const heroWork = computed(
    () => works.value.find((w) => w.id === portfolio.value?.heroWorkId) ?? works.value[0] ?? null,
  );

  onMounted(async () => {
    if (slug === DEMO_SLUG) { // DEMO: remove with src/demo
      portfolio.value = demoPortfolio;
      works.value = demoWorks;
      isLoading.value = false;
      return;
    }
    try {
      portfolio.value = await getPortfolioBySlug(slug);
      if (portfolio.value) works.value = await listPublishedWorks(portfolio.value.id);
    } catch (error) {
      console.error("Failed to load portfolio:", error);
    } finally {
      isLoading.value = false;
    }
  });

  return { portfolio, works, heroWork, isLoading };
}

/** Public page data for a single published work. */
export function usePublicWork(slug: string, workId: string) {
  const portfolio = ref<Portfolio | null>(null);
  const work = ref<PortfolioWork | null>(null);
  const isLoading = ref(true);

  onMounted(async () => {
    if (slug === DEMO_SLUG) { // DEMO: remove with src/demo
      portfolio.value = demoPortfolio;
      work.value = demoWorks.find((w) => w.id === workId) ?? null;
      isLoading.value = false;
      return;
    }
    try {
      portfolio.value = await getPortfolioBySlug(slug);
      if (portfolio.value) work.value = await getPublishedWork(portfolio.value.id, workId);
    } catch (error) {
      console.error("Failed to load portfolio work:", error);
    } finally {
      isLoading.value = false;
    }
  });

  return { portfolio, work, isLoading };
}
