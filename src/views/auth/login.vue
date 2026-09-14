<template>
  <AuthLayout
    description="Welcome back to your studio."
    linkText="New here? Create an account"
    href="/login"
  >
    <form action="" class="space-y-4">
      <div>
        <label for="" class="text-sm">Email</label>
        <Input placeholder="please eanter email..." />
      </div>
      <div>
        <label for="" class="text-sm">Password</label>
        <Input placeholder="......" />
        <div class="text-end">
          <Button class="text-xs" variant="link">Forgot password?</Button>
        </div>
      </div>
      <Button class="w-full">Login</Button>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import AuthLayout from "@/layout/AuthLayout.vue";
</script>
