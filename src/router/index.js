import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/services/api";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Cursos from "../views/Cursos.vue";
import bolsaLaboral from "../views/bolsaLaboral.vue";
import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";
import Documentos from "../views/Documentos.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cursos",
    name: "cursos",
    component: Cursos,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/bolsalaboral",
    name: "bolsalaboral",
    component: bolsaLaboral,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/documentos",
    name: "documentos",
    component: Documentos,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      guest: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to) => {
  const authenticated = Boolean(getToken());
  if (to.meta.requiresAuth && !authenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  if (to.meta.guest && authenticated) return { name: "dashboard" };
});

export default router;
