<template>
  <nav
    class="fixed z-50 left-1/2 -translate-x-1/2 bottom-4 lg:top-4 lg:bottom-auto rounded-full p-1.5 border border-white/40 bg-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5"
  >
    <div class="flex items-center gap-1">
      <Tooltip v-for="link in navLinks" :key="link.name" :text="link.name">
        <RouterLink
          :to="link.path"
          exact-active-class="bg-black text-white"
          active-class="bg-black text-white hover:bg-black"
          class="group relative flex flex-col items-center justify-center gap-0.5 rounded-full p-2 text-gray-500 transition-all duration-200 hover:bg-background"
        >
          <component
            :is="link.icon"
            class="h-4 w-4 transition-transform duration-200 group-hover:scale-105"
          />
        </RouterLink>
      </Tooltip>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Home, Images, Settings, Shirt, Users } from "@lucide/vue";
import Tooltip from "./Tooltip.vue";

const navLinks = [
  {
    name: "Overview",
    path: "/overview",
    icon: Home,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: Shirt,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: Images,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
</script>
