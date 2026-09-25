import { computed, reactive, ref } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useOrderStore } from "@/stores/order";
import { orderSchema, type OrderSchemaType } from "@/schema/order";
import { createEmptyMeasurements } from "@/constants/measurements";
import { generateId } from "@/lib";
import { derivePaymentStatus } from "@/constants/orders";
import type {
  OrderType,
  OrderRequirement,
  FabricSource,
  MeasurementSnapshot,
  ProductionStatus,
  OrderImage,
} from "@/types/order";

export interface OrderFormState {
  customerId: string;
  customerName: string;
  customerPhone: string;
  garmentType: string;
  description: string;
  notes: string;
  dueDate: string | null;
  requirements: OrderRequirement[];
  fabricSource: FabricSource;
  measurements: MeasurementSnapshot;
  total: number;
  deposit: number; // create-mode only; ignored when editing
}

function emptyMeasurementSnapshot(): MeasurementSnapshot {
  return {
    unit: "in",
    values: createEmptyMeasurements(),
    customFields: [],
    source: "customer_default",
  };
}

function toFormState(order?: OrderType | null): OrderFormState {
  if (!order) {
    return {
      customerId: "",
      customerName: "",
      customerPhone: "",
      garmentType: "",
      description: "",
      notes: "",
      dueDate: null,
      requirements: [],
      fabricSource: "customer_supplied",
      measurements: emptyMeasurementSnapshot(),
      total: 0,
      deposit: 0,
    };
  }

  return {
    customerId: order.customerId,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    garmentType: order.garmentType,
    description: order.description,
    notes: order.notes,
    dueDate: order.dueDate,
    requirements: order.requirements.map((r) => ({ ...r })),
    fabricSource: order.fabricSource,
    measurements: { ...order.measurements, values: { ...order.measurements.values } },
    total: order.total,
    deposit: 0,
  };
}

export function useOrderForm(order?: OrderType | null) {
  const customerStore = useCustomerStore();
  const orderStore = useOrderStore();

  const isEditing = computed(() => Boolean(order?.id));
  const form = reactive<OrderFormState>(toFormState(order));
  const errors = ref<Record<string, string>>({});
  const isSubmitting = ref(false);

  const selectedCustomer = computed(() =>
    form.customerId ? customerStore.getCustomerById(form.customerId) : null,
  );

  function setCustomer(customerId: string) {
    form.customerId = customerId;
    const customer = customerStore.getCustomerById(customerId);
    if (!customer) return;

    form.customerName = customer.name;
    form.customerPhone = customer.phone;

    // Only auto-copy measurements when the user hasn't deliberately switched
    // to order-specific ones already (e.g. picking a different customer
    // after starting to type custom measurements shouldn't wipe their work).
    if (form.measurements.source === "customer_default" || !isEditing.value) {
      useCustomerDefaults();
    }
  }

  function useCustomerDefaults() {
    const customer = selectedCustomer.value;
    form.measurements = {
      unit: customer?.unit ?? "in",
      values: customer ? { ...customer.measurements } : createEmptyMeasurements(),
      customFields: customer ? [...customer.customFields] : [],
      source: "customer_default",
    };
  }

  function useOrderSpecificMeasurements() {
    form.measurements = { ...form.measurements, source: "order_specific" };
  }

  function addRequirement(label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    form.requirements.push({ id: generateId("req"), label: trimmed, done: false });
  }

  function removeRequirement(id: string) {
    form.requirements = form.requirements.filter((r) => r.id !== id);
  }

  function toggleRequirement(id: string) {
    const req = form.requirements.find((r) => r.id === id);
    if (req) req.done = !req.done;
  }

  function buildSchemaInput(): OrderSchemaType {
    return {
      customerId: form.customerId,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      garmentType: form.garmentType,
      description: form.description,
      notes: form.notes,
      dueDate: form.dueDate,
      requirements: form.requirements,
      fabricSource: form.fabricSource,
      measurements: form.measurements,
      status: "Order Received" as ProductionStatus, // only used on create; ignored on update
      total: form.total,
      deposit: isEditing.value ? 0 : form.deposit,
    };
  }

  function validate(): OrderSchemaType | null {
    errors.value = {};
    const result = orderSchema.safeParse(buildSchemaInput());
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.value[issue.path[0] as string] = issue.message;
      }
      return null;
    }
    return result.data;
  }

  async function submit(referenceImages: OrderImage[]): Promise<string | null> {
    if (isSubmitting.value) return null; // guards against double-click / double-submit
    const data = validate();
    if (!data) return null;

    isSubmitting.value = true;
    try {
      if (isEditing.value && order) {
        const paymentStatus = derivePaymentStatus(data.total, order.paid);
        await orderStore.updateOrder(order.id, {
          customerId: data.customerId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          garmentType: data.garmentType,
          description: data.description,
          notes: data.notes,
          dueDate: data.dueDate,
          requirements: data.requirements,
          fabricSource: data.fabricSource,
          measurements: data.measurements,
          total: data.total,
          balance: data.total - order.paid,
          paymentStatus,
          referenceImages,
        });
        return order.id;
      }

      return await orderStore.addOrder(data, referenceImages);
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    selectedCustomer,
    setCustomer,
    useCustomerDefaults,
    useOrderSpecificMeasurements,
    addRequirement,
    removeRequirement,
    toggleRequirement,
    submit,
  };
}