import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("./views/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/auth/login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/auth/register.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
