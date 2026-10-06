<template>
  <div class="min-h-screen bg-gradient-to-b from-butter/40 via-white to-white">
    <header class="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <span class="font-display text-lg font-medium tracking-tight">Fitelle</span>
      <RouterLink to="/login" class="text-xs font-medium text-muted-foreground hover:text-foreground">
        Log in
      </RouterLink>
    </header>

    <main class="mx-auto max-w-5xl px-6 pb-20 pt-6 sm:pt-12">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">For tailors & fashion designers</p>
        <h1 class="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Your business, in your pocket.
        </h1>
        <p class="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          Orders, measurements, payments and your portfolio — all in one place, built for the way you actually work.
        </p>
      </div>

      <div class="mt-10 sm:mt-14">
        <InstallCard />
      </div>

      <!-- Quick feature strip -->
      <div class="mx-auto mt-20 grid max-w-3xl gap-8 sm:grid-cols-3">
        <div v-for="item in features" :key="item.title" class="text-center sm:text-left">
          <component :is="item.icon" class="mx-auto size-5 text-primary sm:mx-0" />
          <p class="mt-3 font-display text-base">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-6 text-muted-foreground">{{ item.text }}</p>
        </div>
      </div>
    </main>

    <footer class="border-t border-border/60 py-6 text-center text-[11px] text-muted-foreground">
      © {{ new Date().getFullYear() }} Fitelle
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Shirt, Users, Images } from "@lucide/vue";
import InstallCard from "@/components/landing/InstallCard.vue";

const features = [
  { icon: Shirt, title: "Orders that track themselves", text: "From first measurement to final handover, with your customer following along." },
  { icon: Users, title: "A client book that remembers", text: "Every measurement, preference and order history, right where you need it." },
  { icon: Images, title: "A portfolio worth sharing", text: "A beautiful public page for your best work — one link, sent anywhere." },
];
</script>