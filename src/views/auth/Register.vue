<template>
  <AuthLayout
    description="Create your account and start your journey with us."
    linkText="ALready have an account? Login"
    href="/login"
  >
    <form action="" class="space-y-4">
      <div>
        <label for="" class="text-sm">Business name</label>
        <Input placeholder="Authentic Brands..." />
      </div>
      <div>
        <label for="" class="text-sm">Email</label>
        <Input placeholder="you@studio.com" />
      </div>
      <div>
        <label for="" class="text-sm">Password</label>
        <Input placeholder="......" />
      </div>
      <Button class="w-full">Create account</Button>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import AuthLayout from "@/layout/AuthLayout.vue";
</script>
