import { createRouter, createWebHistory, NavigationGuardNext, type RouteLocationNormalized, type RouteRecordRaw } from "vue-router";
import { createToken, createUserByToken, getToken } from "@/utils/tokenUtils";
import { refreshToken } from "@/services/auth";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "logged",
    children: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
    ],
  },
  {
    path: "/",
    name: "not-logged",
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () => import("../views/SignUp.vue"),
      }
    ]
  },
];

function routesNotLogged(): string[] {
  const [notLoggedRoute] = routes.filter((route) => route.name === "not-logged");
  const children = notLoggedRoute?.children?.map((child) => child.name);

  return children?.toString()?.split(",") || [];
}

async function checkUserIsConnected(to: RouteLocationNormalized): Promise<boolean> {
  const token = getToken();

  if (token !== "") {
    createUserByToken(token);
    return true;
  }

  if (routesNotLogged().includes(to.name?.toString() || "")) return false;

  const { data, error } = await refreshToken();

  if (error || !data) return false;

  createToken(data.token);
  return true;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const isConnected = await checkUserIsConnected(to);

    if (!isConnected && !routesNotLogged().includes(to.name?.toString() || "")) {
      next({ name: "login" });
      return;
    }

    if (isConnected && routesNotLogged().includes(to.name?.toString() || "")) {
      next({ name: "home" });
      return;
    }

    next();
});

export default router;
