<template>
  <canvas ref="canvasRef" class="rounded-xl" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
// import QRCode from "qrcode";

const props = withDefaults(
  defineProps<{
    value: string;
    size?: number;
  }>(),
  { size: 160 },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);

async function render() {
  if (!canvasRef.value) return;
//   await QRCode.toCanvas(canvasRef.value, props.value, {
//     width: props.size,
//     margin: 1,
//     color: { dark: "#111111", light: "#ffffff" },
//   });
}

onMounted(render);
watch(() => props.value, render);
</script>