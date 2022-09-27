import { createRouter, createWebHistory } from "vue-router";
import MapViewer from "../views/MapViewer.vue";

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapViewer,
    },
  ],
});

export default router;
