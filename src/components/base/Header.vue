<template>
  <div class="flex md:flex-row flex-col gap-2 justify-between">
    <div class="flex items-center gap-3">
      <Button
        v-if="back"
        variant="ghost"
        size="icon"
        @click="goBack"
      >
        <ChevronLeft class="size-5 text-primary" />
      </Button>

      <div class="space-y-1">
        <p class="text-primary font-light text-xs text-capitalize">
          {{ text }}
        </p>

        <p class="md:text-3xl text-xl font-medium font-san">
          {{ title }}
        </p>

        <p class="text-sm text-gray-500 font-light">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 flex-wrap">
      <slot />

      <Button
        v-if="button"
        @click="emit('button-click')"
        size="sm"
        class="w-fit"
      >
        <PlusIcon />
        {{ button }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, PlusIcon } from "@lucide/vue";
import { useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";

defineProps<{
  title: string;
  subtitle: string;
  button?: string;
  text?: string;
  back?: boolean;
}>();

const emit = defineEmits<{
  "button-click": [];
}>();

const router = useRouter();

function goBack() {
  router.back();
}
</script>