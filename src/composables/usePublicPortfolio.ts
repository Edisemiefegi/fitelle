import { onMounted, ref } from "vue";
import { getPortfolioBySlug, getPublishedWork, listPublishedWorks } from "@/service/portfolio";
import type { Portfolio, PortfolioWork } from "@/types/portfolio";

/** Public page data: the business and its published works. */
export function usePublicPortfolio(slug: string) {
  const portfolio = ref<Portfolio | null>(null);
  const works = ref<PortfolioWork[]>([]);
  const isLoading = ref(true);

  onMounted(async () => {
    try {
      portfolio.value = await getPortfolioBySlug(slug);
      if (portfolio.value) works.value = await listPublishedWorks(portfolio.value.id);
    } catch (error) {
      console.error("Failed to load portfolio:", error);
    } finally {
      isLoading.value = false;
    }
  });

  return { portfolio, works, isLoading };
}

/** Public page data for a single published work. */
export function usePublicWork(slug: string, workId: string) {
  const portfolio = ref<Portfolio | null>(null);
  const work = ref<PortfolioWork | null>(null);
  const isLoading = ref(true);

  onMounted(async () => {
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
