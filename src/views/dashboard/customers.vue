<template>
  <main class="space-y-5">
    <Header
      @button-click="openAddModal"
      title="Customers"
      button="Add customer"
      subtitle="Your client book, with every preference and measurement close at hand"
      text="People behind the pieces"
    />

    <AddCustomer
      :modal-open="modalOpen"
      @update:modal-open="modalOpen = $event"
      :customer="editingCustomer"
      @saved="closeModal"
    />

    <div class="flex justify-between">
      <Search
        class="w-full max-w-2/3"
        v-model="search"
        placeholder="Search by customer name or number"
      />

      <p class="flex items-center gap-1 text-xs text-muted-foreground">
        <Users class="size-4" />
        {{ filteredCustomers.length }} clients
      </p>
    </div>

    <Table
      :columns="customerColumns"
      :rows="filteredCustomers"
      :loading="isLoading"
      empty-message="No customers found."
    >
      <template #cell-name="{ row }">
        <div>
          <p class="font-medium">
            {{ row.name }}
          </p>
        </div>
      </template>

      <template #cell-orders="{ row }">
        <span class="font-medium">
          {{ row.orders }}
        </span>
      </template>

      <template #cell-phone="{ row }">
        <span class="text-muted-foreground">
          {{ row.phone }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <PopOver content-class="w-fit p-1.5">
          <template #trigger>
            <Button variant="ghost">
              <Ellipsis class="size-4" />
            </Button>
          </template>

          <div v-for="btn in customerActions">
            <Button
              size="sm"
              class="text-[10px] hover:bg-muted w-full justify-start"
              variant="ghost"
              @click.stop="btn.onClick(row)"
            >
              <component :is="btn.icon" class="size-2.5" />
              {{ btn.label }}
            </Button>
          </div>
        </PopOver>
      </template>
    </Table>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Header from "@/components/base/Header.vue";
import Search from "@/components/base/Search.vue";
import { Eye, Trash2, Ellipsis, Users, MessageCircle } from "@lucide/vue";
import Table from "@/components/base/Table.vue";
import PopOver from "@/components/base/PopOver.vue";
import Button from "@/components/ui/button/Button.vue";
import { useRouter } from "vue-router";
import AddCustomer from "@/components/customer/AddCustomer.vue";
import { useCustomerStore } from "@/stores/customer";
import type { CustomerType } from "@/types/customer";

const search = ref("");
const modalOpen = ref(false);
const editingCustomer = ref<CustomerType | null>(null);
const router = useRouter();

const { fetchCustomers, isLoading, searchCustomers, deleteCustomer } =
  useCustomerStore();

const filteredCustomers = computed(() => searchCustomers(search.value));

onMounted(() => {
  fetchCustomers();
});

function openAddModal() {
  editingCustomer.value = null;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingCustomer.value = null;
}

const customerActions = [
  {
    label: "View",
    icon: Eye,
    onClick: (customer: CustomerType) => {
      router.push(`/customers/${customer.id}`);
    },
  },

  {
    label: "Whatsapp",
    icon: MessageCircle,
    onClick: (customer: CustomerType) => {
      window.open(
        `https://wa.me/${customer.phone.replace(/\D/g, "")}`,
        "_blank",
      );
    },
  },
  {
    label: "Delete",
    icon: Trash2,
    onClick: async (customer: CustomerType) => {
      const confirmed = window.confirm(
        `Delete ${customer.name}? This can't be undone.`,
      );
      if (!confirmed) return;
      await deleteCustomer(customer.id);
    },
  },
];

const customerColumns = [
  { key: "name", label: "Customer" },
  { key: "orders", label: "Orders" },
  { key: "phone", label: "Phone" },
  { key: "actions", label: "Actions" },
];
</script>

<style scoped></style>
