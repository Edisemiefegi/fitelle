<template>
  <main class="space-y-5">
    <Header
      title="Good morning, Nuru."
      subtitle="Here is the shape of your atelier today. Three fittings, one collection, and a little room for new work."
      button="New order"
      text="Tuesday studio notes"
    />

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Stats v-for="stat in stats" :key="stat.title" v-bind="stat" />
    </div>

  <div class="grid grid-cols-3 gap-4">
      <RecentOrder class="md:col-span-2 col-span-3"/>
      <Card class="bg-primary/50!">

      </Card>
  </div>
  </main>
</template>

<script setup lang="ts">
import Card from "@/components/base/Card.vue";
import Header from "@/components/base/Header.vue";
import Stats from "@/components/base/Stats.vue";
import { ShoppingCartIcon, UsersIcon, PackageIcon } from "@lucide/vue";
import RecentOrder from "@/components/orders/RecentOrder.vue";

const stats = [
  {
    title: "IN PROGRESS",
    amount: "12",
    icon: ShoppingCartIcon,
    text: "pieces on the table",
    bgClass: "bg-pink",
  },
  {
    title: "DUE THIS WEEK",
    amount: "5",
    icon: UsersIcon,
    text: "keep up the pace",
    bgClass: "bg-mint",
  },
  {
    title: "COLLECTED",
    amount: "₦1,385,000",
    icon: PackageIcon,
    text: "from 6 orders",
    bgClass: "bg-butter",
  },
  {
    title: "OUTSTANDING BAL",
    amount: "₦13,5000",
    icon: PackageIcon,
    text: "across 6 orders",
    bgClass: "bg-lilac",
  },
];
</script>
