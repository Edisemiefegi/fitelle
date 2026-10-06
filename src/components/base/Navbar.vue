<template>
  <nav
    class="fixed z-50 left-1/2 -translate-x-1/2 bottom-4 lg:top-4 lg:bottom-auto isolate rounded-full p-1.5 bg-white/25 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.14),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),rgba(255,255,255,0)_55%)]"
  >
    <div class="flex items-center sm:gap-1 gap-5">
      <Tooltip v-for="link in navLinks" :key="link.name" :text="link.name">
        <RouterLink
          :to="link.path"
          :class="[
            'group relative flex flex-col items-center justify-center gap-0.5 rounded-full p-2 transition-all duration-200 active:scale-90',
            isActive(link.path)
              ? 'bg-black/85 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.25)]'
              : 'text-gray-500 hover:bg-white/55 hover:text-foreground hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]',
          ]"
        >
          <component
            :is="link.icon"
            class="h-5 w-5 transition-transform duration-200 group-hover:scale-105"
          />
        </RouterLink>
      </Tooltip>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { Home, Images, Settings, Shirt, Users } from "@lucide/vue";
import Tooltip from "./Tooltip.vue";

const route = useRoute();

const navLinks = [
  { name: "Overview", path: "/overview", icon: Home },
  { name: "Orders", path: "/orders", icon: Shirt },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Portfolio", path: "/portfolio", icon: Images },
  { name: "Settings", path: "/settings", icon: Settings },
];

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`);
}
</script>
