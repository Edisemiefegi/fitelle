<template>
  <button
    type="button"
    class="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted text-left"
    @click="emit('edit', work)"
  >
    <img
      v-if="cover"
      :src="cover.url"
      :alt="work.title"
      class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
    <div v-else class="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
      No photos yet
    </div>

    <!-- Always-on gradient + title, editorial style -->
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 pt-10">
      <p class="font-display text-sm font-medium text-white">{{ work.title }}</p>
      <p class="text-[10px] uppercase tracking-wide text-white/70">{{ work.category }}</p>
    </div>

    <!-- Status pill -->
    <span
      class="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-medium"
      :class="work.status === 'published' ? 'bg-emerald-500/90 text-white' : 'bg-white/90 text-foreground'"
    >
      {{ work.status === "published" ? "Published" : "Draft" }}
    </span>

    <!-- Quick actions -->
    <div class="absolute right-2.5 top-2.5" @click.stop>
      <PopOver content-class="w-40 p-1">
        <template #trigger>
          <span
            class="flex size-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
          >
            <Ellipsis class="size-4" />
          </span>
        </template>

        <Button size="sm" variant="ghost" class="w-full justify-start text-xs" @click="emit('edit', work)">
          <Pencil class="size-3" />
          Edit
        </Button>
        <Button size="sm" variant="ghost" class="w-full justify-start text-xs" @click="togglePublish">
          <component :is="work.status === 'published' ? EyeOff : Eye" class="size-3" />
          {{ work.status === "published" ? "Unpublish" : "Publish" }}
        </Button>
        <Button size="sm" variant="ghost" class="w-full justify-start text-xs text-danger" @click="emit('delete', work)">
          <Trash2 class="size-3" />
          Delete
        </Button>
      </PopOver>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Ellipsis, Eye, EyeOff, Pencil, Trash2 } from "@lucide/vue";
import PopOver from "@/components/base/PopOver.vue";
import Button from "@/components/ui/button/Button.vue";
import { getCoverImage } from "@/constants/portfolio";
import { usePortfolioStore } from "@/stores/portfolio";
import type { PortfolioWork } from "@/types/portfolio";

const props = defineProps<{
  work: PortfolioWork;
}>();

const emit = defineEmits<{
  edit: [work: PortfolioWork];
  delete: [work: PortfolioWork];
}>();

const portfolioStore = usePortfolioStore();
const cover = computed(() => getCoverImage(props.work));

function togglePublish() {
  portfolioStore.setPublished(props.work.id, props.work.status === "published" ? "draft" : "published");
}
</script>