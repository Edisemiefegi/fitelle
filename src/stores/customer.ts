import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  db,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "@/service/firebase";
import type { CustomerType, MeasurementField } from "@/types/customer";
import type { CustomerSchemaType } from "@/schema";
import {
  createEmptyMeasurements,
  generateUniqueFieldKey,
} from "@/constants/measurements";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [] as CustomerType[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getCustomerById:
      (state) =>
      (id: string): CustomerType | null =>
        state.customers.find((c) => c.id === id) ?? null,

    searchCustomers:
      (state) =>
      (query: string): CustomerType[] => {
        const q = query.trim().toLowerCase();
        if (!q) return state.customers;

        const qDigits = q.replace(/\D/g, "");

        return state.customers.filter((c) => {
          const nameMatch = c.name.toLowerCase().includes(q);
          const phoneMatch =
            qDigits.length > 0 && c.phone.replace(/\D/g, "").includes(qDigits);
          return nameMatch || phoneMatch;
        });
      },

    totalCustomers: (state) => state.customers.length,
  },

  actions: {
    async addNewCustomer(customer: CustomerSchemaType): Promise<string> {
      try {
        const payload = {
          ...customer,
          measurements: customer.measurements ?? createEmptyMeasurements(),
          customFields: customer.customFields ?? [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, "customers"), payload);
        await updateDoc(docRef, { id: docRef.id });

        this.customers.unshift({ ...payload, id: docRef.id } as CustomerType);
        return docRef.id;
      } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
      }
    },

    async updateCustomer(id: string, updates: Partial<CustomerType>) {
      try {
        const ref = doc(db, "customers", id);
        const payload = { ...updates, updatedAt: new Date().toISOString() };
        await updateDoc(ref, payload);

        const index = this.customers.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...payload };
        }
      } catch (error) {
        console.error("updateCustomer error:", error);
        throw error;
      }
    },

    async addMeasurementField(
      id: string,
      label: string,
    ): Promise<MeasurementField> {
      const customer = this.getCustomerById(id);
      if (!customer) throw new Error("Customer not found");

      const existingKeys = [
        ...Object.keys(customer.measurements),
        ...customer.customFields.map((f) => f.key),
      ];
      const key = generateUniqueFieldKey(label, existingKeys);

      const newField: MeasurementField = {
        key,
        label,
        category: "custom",
        isCustom: true,
      };
      const customFields = [...customer.customFields, newField];
      const measurements = { ...customer.measurements, [key]: null };

      await this.updateCustomer(id, { customFields, measurements });
      return newField;
    },

    async fetchCustomers() {
      this.isLoading = true;
      this.error = null;
      try {
        const snapshot = await getDocs(collection(db, "customers"));
        this.customers = snapshot.docs.map(
          (docSnap: any) =>
            ({ ...docSnap.data(), id: docSnap.id }) as CustomerType,
        );
      } catch (error) {
        this.error = "Failed to load customers.";
        console.error("fetchCustomers error:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCustomer(id: string): Promise<CustomerType | null> {
      const existing = this.getCustomerById(id);
      if (existing) return existing;

      await this.fetchCustomers();
      return this.getCustomerById(id);
    },

    async deleteCustomer(id: string) {
      try {
        await deleteDoc(doc(db, "customers", id));
        this.customers = this.customers.filter((c) => c.id !== id);
      } catch (error) {
        console.error("deleteCustomer error:", error);
        throw error;
      }
    },
  },

  persist: true,
});
