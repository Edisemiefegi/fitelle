<template>
  <section
    id="contact"
    class="bg-[#171614] px-5 py-24 text-white md:px-10 md:py-32 lg:px-16"
  >
    <div class="mx-auto max-w-[1472px]">
      <div class="max-w-5xl">
        <p class="text-[10px] uppercase tracking-[0.22em] text-white/50">
          Let's begin
        </p>

        <h2
          class="mt-6 font-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.88] tracking-[-0.055em]"
        >
          Let's make something personal.
        </h2>
      </div>

      <div
        class="mt-16 grid gap-12 border-t border-white/15 pt-8 md:grid-cols-2 md:items-end"
      >
        <div>
          <p class="max-w-sm text-sm leading-7 text-white/55">
            Have a piece in mind, an occasion coming up, or simply want to
            discuss an idea?
          </p>

          <a
            v-if="whatsappUrl"
            :href="whatsappUrl"
            target="_blank"
            rel="noreferrer"
            class="group mt-8 inline-flex items-center gap-3 border-b border-white/60 pb-3 text-sm uppercase tracking-[0.14em]"
          >
            Start a conversation

            <ArrowUpRight
              class="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>

        <div class="space-y-4 text-sm md:justify-self-end">
          <p v-if="contact.location" class="text-white/70">{{ contact.location }}</p>

          <a
            v-for="link in links"
            :key="link.label"
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            rel="noreferrer"
            class="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
          >
            <component :is="link.icon" class="size-4" />
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpRight, AtSign, Globe, Mail, Music2, Phone } from "@lucide/vue";
import { toSocialLink, toWhatsAppLink } from "@/lib";
import type { Portfolio } from "@/types/portfolio";

const props = defineProps<{ portfolio: Portfolio }>();

const contact = computed(() => props.portfolio.contact);

const whatsappUrl = computed(() =>
  contact.value.whatsapp && contact.value.phone
    ? toWhatsAppLink(contact.value.phone, `Hello ${props.portfolio.brandName}, I'd like to make an enquiry.`)
    : "",
);

const links = computed(() => {
  const c = contact.value;
  return [
    c.email && { icon: Mail, label: c.email, href: `mailto:${c.email}`, external: false },
    c.phone && { icon: Phone, label: c.phone, href: `tel:${c.phone}`, external: false },
    c.instagram && { icon: AtSign, label: "Instagram", href: toSocialLink("instagram", c.instagram), external: true },
    c.tiktok && { icon: Music2, label: "TikTok", href: toSocialLink("tiktok", c.tiktok), external: true },
    c.facebook && { icon: Globe, label: "Facebook", href: toSocialLink("facebook", c.facebook), external: true },
  ].filter((link) => !!link);
});
</script>
