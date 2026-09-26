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
   
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./views/auth/signup.vue"),
  },

   {
        path: "/track/:slug",
        name: "Slug",
        component: () => import("@/views/dashboard/orders/[slug].vue"),
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
        component: () => import("@/views/dashboard/orders/index.vue"),
      },
      {
        path: "/orders/:id",
        name: "OrderId",
        component: () => import("@/views/dashboard/orders/[id].vue"),
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
