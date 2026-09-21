<template>
  <AuthLayout
    description="Create your account and start your journey with us."
    linkText="ALready have an account? Login"
    href="/login"
  >
    <form @submit.prevent="handleRegister" class="space-y-4">
      <Field label="Business name" required :error="errors.brandName?.[0]">
        <Input v-model="form.brandName" placeholder="Authentic Brands..." />
      </Field>

      <Field label="Email" required :error="errors.email?.[0]">
        <Input v-model="form.email" type="email" placeholder="you@studio.com" />
      </Field>
      <Field label="Password" required :error="errors.password?.[0]">
        <Input v-model="form.password" type="password" placeholder="••••••••" />
      </Field>
      <Button :loading="isLoading" type="submit" class="w-full"
        >Create account</Button
      >
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Field from "@/components/base/Field.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { authSchema } from "@/schema";
import { useRouter } from "vue-router";

const form = ref({
  brandName: "",
  email: "",
  password: "",
});
const isLoading = ref(false);
const errors = ref<Record<string, string[]>>({});
const router = useRouter();

const { registerUser } = useAuthStore();

const handleRegister = async () => {
  errors.value = {};
  try {
    isLoading.value = true;
    const result = authSchema(true).safeParse(form.value);
    if (!result.success) {
      errors.value = result.error.flatten().fieldErrors;
      return;
    }

    await registerUser(result.data);
    router.push("/overview");
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};
</script>
