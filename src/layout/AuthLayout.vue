<template>
  <div>
    <Backdrop />
   <div class="h-screen flex justify-center  items-center">
     <div class=" w-11/12 md:w-3/5 lg:w-3/7 pt-4">
      <card :class="'space-y-6'">
        <h1 class="text-xl">
          Fit<span class="text-primary">elle</span>
          <p class="text-xs text-gray-500">{{ description }}</p>
        </h1>
        <div>
          <slot />

          <div class="text-center text-primary text-sm pt-2">
            <RouterLink :to=href>{{ linkText }}</RouterLink>
          </div>
        </div>
      </card>
    </div>
   </div>
  </div>
</template>

<script setup lang="ts">
import Backdrop from "@/components/base/Backdrop.vue";
import Card from "@/components/base/Card.vue";

interface AuthProps {
  description: string;
  href: string;
  linkText: string;
}
const props = withDefaults(defineProps<AuthProps>(), {});
</script>

<style lang="scss" scoped></style>
