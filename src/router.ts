import { createRouter, createWebHistory } from "vue-router";
import { authMiddleware } from "./middleware/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./views/index.vue"),
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
    component: () => import("@/views/track/[slug].vue"),
  },

  {
    path: "/dashboard",
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
        component: () => import("@/views/dashboard/customers/index.vue"),
      },
      {
        path: "/customers/:id",
        name: "CustomerId",
        component: () => import("@/views/dashboard/customers/[id].vue"),
      },
      {
        path: "/notifications",
        name: "Notifications",
        component: () => import("@/views/dashboard/notifications.vue"),
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/dashboard/settings.vue"),
      },
      {
        path: "/portfolio",
        name: "Portfolio",
        component: () => import("@/views/dashboard/portfolio/index.vue"),
      },
    ],
  },

  {
    path: "/portfolio/:slug/:workId",
    name: "PublicPortfolioWork",
    component: () => import("@/views/portfolio/[workId].vue"),
  },
  {
    path: "/portfolio/:slug",
    name: "PublicPortfolio",
    component: () => import("@/views/portfolio/[slug].vue"),
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
