import { createRouter, createWebHistory } from "vue-router";
import HomeViewer from "../views/HomeViewer.vue";

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeViewer,
    },
  ],
});

export default router;
