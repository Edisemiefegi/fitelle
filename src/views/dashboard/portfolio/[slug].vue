<template>
  <div v-if="business" class="min-h-screen bg-white">
    <PublicPortfolioHeader :business="business" />

    <main class="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div v-if="isLoading" class="columns-2 gap-4 sm:columns-3 lg:columns-4">
        <div
          v-for="i in 8"
          :key="i"
          class="mb-4 animate-pulse break-inside-avoid rounded-2xl bg-muted/60"
          :style="{ height: `${180 + (i % 3) * 60}px` }"
        />
      </div>

      <div v-else-if="!works.length" class="py-20 text-center">
        <p class="font-display text-lg">No work published yet</p>
        <p class="mt-1 text-sm text-muted-foreground">Check back soon.</p>
      </div>

      <div v-else class="columns-2 gap-4 sm:columns-3 lg:columns-4">
        <RouterLink
          v-for="work in works"
          :key="work.id"
          :to="`/portfolio/${slug}/${work.id}`"
          class="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-muted"
        >
          <img
            v-if="coverUrl(work)"
            :src="coverUrl(work)!"
            :alt="work.title"
            class="w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100"
          >
            <p class="font-display text-sm text-white">{{ work.title }}</p>
            <p class="text-[10px] uppercase tracking-wide text-white/75">{{ work.category }}</p>
          </div>
        </RouterLink>
      </div>
    </main>

    <footer class="border-t border-border/60 py-6 text-center text-[11px] text-muted-foreground">
      Built with
      <RouterLink to="/" class="font-medium text-foreground hover:underline">Fitelle</RouterLink>
    </footer>
  </div>

  <div v-else-if="isLoadingBusiness" class="flex min-h-screen items-center justify-center">
    <div class="h-10 w-48 animate-pulse rounded-full bg-muted/60" />
  </div>

  <div v-else class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <p class="font-display text-xl">This portfolio isn't available</p>
    <p class="mt-1 text-sm text-muted-foreground">Double-check the link you were given.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PublicPortfolioHeader from "@/components/portfolio/PublicPortfolioHeader.vue";
import { fetchBusinessBySlug, fetchPublishedWorks } from "@/service/publicPortfolio";
import { getCoverImage } from "@/constants/portfolio";
import type { PublicBusinessProfile, PublicPortfolioWork } from "@/types/portfolio";

const route = useRoute();
const slug = route.params.slug as string;

const business = ref<(PublicBusinessProfile & { userId: string }) | null>(null);
const works = ref<PublicPortfolioWork[]>([]);
const isLoadingBusiness = ref(true);
const isLoading = ref(true);

function coverUrl(work: PublicPortfolioWork) {
  return getCoverImage(work)?.url ?? null;
}

onMounted(async () => {
  try {
    business.value = await fetchBusinessBySlug(slug);
    if (business.value) {
      works.value = await fetchPublishedWorks(business.value.userId);
    }
  } catch (error) {
    console.error("Failed to load public portfolio:", error);
  } finally {
    isLoadingBusiness.value = false;
    isLoading.value = false;
  }
});
</script>