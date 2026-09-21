<template>
  <Card class="space-y-4">
    <div class="flex justify-between align-items-center">
      <p class="font-semibold font-mono">Recent orders</p>
      <RouterLink to="/orders" class="text-primary text-xs"
        >View all</RouterLink
      >
    </div>
    <div
      v-for="order in orders"
      :key="order.id"
      class="flex justify-between font-display border-b pb-2"
    >
      <div>
        <p class="font-semibold text-sm">{{ order.clothingType }}</p>
        <p class="text-xs text-gray-600">
          {{ order.customerName }} | due {{ order.dueDate }}
        </p>
      </div>
      <div class="flex items-center">
        <span
          :class="statusClasses[order.status]"
          class="py-1 px-2 rounded-full text-xs"
          >{{ order.status }}</span
        >
        <ChevronRight class="w-5 text-gray-500" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";
import Card from "../base/Card.vue";
const orders = [
  {
    id: "ORD-001",
    customerName: "Amaka Okafor",
    clothingType: "Native Set",
    description: "Lace blouse with wrapper",
    status: "Sewing",
    payment: {
      amount: 85000,
      paid: 50000,
      balance: 35000,
    },
    dueDate: "20 Jul",
  },
  {
    id: "ORD-002",
    customerName: "Daniel Eze",
    clothingType: "Agbada",
    description: "3-piece senator agbada",
    status: "Fitting",
    payment: {
      amount: 120000,
      paid: 120000,
      balance: 0,
    },
    dueDate: "18 sep",
  },
  {
    id: "ORD-003",
    customerName: "Blessing Williams",
    clothingType: "Gown",
    description: "Off-shoulder dinner gown",
    status: "Cutting",
    payment: {
      amount: 95000,
      paid: 45000,
      balance: 50000,
    },
    dueDate: "18 sep",
  },
  {
    id: "ORD-004",
    customerName: "Timi Alade",
    clothingType: "Senator",
    description: "Long sleeve senator outfit",
    status: "Ready",
    payment: {
      amount: 70000,
      paid: 70000,
      balance: 0,
    },
    dueDate: "18 sep",
  },
  {
    id: "ORD-005",
    customerName: "Sarah Johnson",
    clothingType: "Two-Piece",
    description: "Crop top and wide-leg trousers",
    status: "Measuring",
    payment: {
      amount: 65000,
      paid: 20000,
      balance: 45000,
    },
    dueDate: "18 sep",
  },
  //   {
  //     id: "ORD-006",
  //     customerName: "Chinedu Obi",
  //     clothingType: "Kaftan",
  //     description: "Embroidered short-sleeve kaftan",
  //     status: "Finishing",
  //     payment: {
  //       amount: 55000,
  //       paid: 55000,
  //       balance: 0,
  //     },
  //     dueDate: "2026-09-19",
  //   },
  //   {
  //     id: "ORD-007",
  //     customerName: "Nneka Ibe",
  //     clothingType: "Skirt & Blouse",
  //     description: "Ankara skirt and peplum blouse",
  //     status: "Order Received",
  //     payment: {
  //       amount: 75000,
  //       paid: 25000,
  //       balance: 50000,
  //     },
  //     dueDate: "2026-10-02",
  //   },
  //   {
  //     id: "ORD-008",
  //     customerName: "Emeka Nwosu",
  //     clothingType: "Native Set",
  //     description: "Linen native two-piece",
  //     status: "Delivered",
  //     payment: {
  //       amount: 80000,
  //       paid: 80000,
  //       balance: 0,
  //     },
  //     dueDate: "2026-09-14",
  //   },
  //   {
  //     id: "ORD-009",
  //     customerName: "Joy Peters",
  //     clothingType: "Bridesmaid Dress",
  //     description: "Custom satin bridesmaid dress",
  //     status: "Sewing",
  //     payment: {
  //       amount: 110000,
  //       paid: 60000,
  //       balance: 50000,
  //     },
  //     dueDate: "2026-09-30",
  //   },
  //   {
  //     id: "ORD-010",
  //     customerName: "Favour George",
  //     clothingType: "Jumpsuit",
  //     description: "Tailored evening jumpsuit",
  //     status: "Cutting",
  //     payment: {
  //       amount: 90000,
  //       paid: 45000,
  //       balance: 45000,
  //     },
  //     dueDate: "2026-09-23",
  //   },
];

const statusClasses: Record<string, string> = {
  "Order Received": "bg-blue-50 text-blue-700",
  Measuring: "bg-purple-50 text-purple-700",
  Cutting: "bg-amber-50 text-amber-700",
  Sewing: "bg-orange-50 text-orange-700",
  Fitting: "bg-pink-50 text-pink-700",
  Finishing: "bg-indigo-50 text-indigo-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Delivered: "bg-green-50 text-green-700",
};
</script>

<style scoped></style>
