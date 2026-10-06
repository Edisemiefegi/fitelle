<template>
  <div v-if="portfolio" class="overflow-hidden bg-white text-foreground">
    <PortfolioHeader :portfolio="portfolio" />

    <main>
      <PortfolioHero :portfolio="portfolio" />
      <PortfolioGallery :works="works" :slug="portfolio.slug" :is-loading="isLoading" />
      <PortfolioAbout :portfolio="portfolio" />
      <PortfolioService :portfolio="portfolio" />
      <PortfolioContact :portfolio="portfolio" />
      <PortfolioFooter :portfolio="portfolio" />
    </main>
  </div>

  <PortfolioLoading v-else-if="isLoading" />

  <PortfolioNotFound v-else />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import PortfolioHeader from "@/components/portfolio/public/PortfolioHeader.vue";
import PortfolioHero from "@/components/portfolio/public/PortfolioHero.vue";
import PortfolioGallery from "@/components/portfolio/public/PortfolioGallery.vue";
import PortfolioAbout from "@/components/portfolio/public/PortfolioAbout.vue";
import PortfolioService from "@/components/portfolio/public/PortfolioService.vue";
import PortfolioContact from "@/components/portfolio/public/PortfolioContact.vue";
import PortfolioFooter from "@/components/portfolio/public/PortfolioFooter.vue";
import PortfolioLoading from "@/components/portfolio/PortfolioLoading.vue";
import PortfolioNotFound from "@/components/portfolio/PortfolioNotFound.vue";
import { usePublicPortfolio } from "@/composables/usePublicPortfolio";

const slug = useRoute().params.slug as string;
const { portfolio, works, isLoading } = usePublicPortfolio(slug);
</script>
