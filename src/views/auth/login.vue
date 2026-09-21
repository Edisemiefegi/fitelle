<template>
  <AuthLayout
    description="Welcome back to your studio."
    linkText="New here? Create an account"
    href="/register"
  >
    <form @submit.prevent="handleLogin" class="space-y-4">
      <Field label="Email" required :error="errors.email?.[0]">
        <Input v-model="form.email" type="email" placeholder="you@studio.com" />
      </Field>
      <Field label="Password" required :error="errors.password?.[0]">
        <Input v-model="form.password" type="password" placeholder="••••••••" />
        <div class="text-end">
          <Button class="text-xs" variant="link">Forgot password?</Button>
        </div>
      </Field>

      <Button type="submit" :loading="isLoading" class="w-full">Login</Button>
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
  email: "",
  password: "",
});
const isLoading = ref(false);
const errors = ref<Record<string, string[]>>({});
const router = useRouter();

const { loginFunc } = useAuthStore();

const handleLogin = async () => {
  errors.value = {};
  try {
    isLoading.value = true;
    const result = authSchema(false).safeParse(form.value);
    if (!result.success) {
      errors.value = result.error.flatten().fieldErrors;
      return;
    }

    await loginFunc(result.data);
    router.push("/overview");
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};
</script>
