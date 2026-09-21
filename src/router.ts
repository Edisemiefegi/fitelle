import { createRouter, createWebHistory } from "vue-router";
import { authMiddleware } from "./middleware/auth";

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("./views/index.vue"),
    meta: {
      guestOnly: true,
    },
  },

  {
    name: "Login",
    path: "/login",
    component: () => import("./views/auth/login.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/auth/register.vue"),
  },

  {
    path: "",
    component: () => import("@/layouts/DashboardLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/overview",
        name: "Overview",
        component: () => import("@/views/dashboard/index.vue"),
      },
      {
        path: "/orders",
        name: "Orders",
        component: () => import("@/views/dashboard/orders.vue"),
      },
      {
        path: "/customers",
        name: "Customers",
        component: () => import("@/views/dashboard/customers.vue"),
      },
       {
        path: "/customers/:id",
        name: "CustomerId",
        component: () => import("@/views/dashboard/customerId.vue"),
      },
      {
        path: "/portfolio",
        name: "Portfolio",
        component: () => import("@/views/dashboard/portfolio.vue"),
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/notFound.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authMiddleware);

export default router;
