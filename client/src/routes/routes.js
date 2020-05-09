import DashboardLayout from "../pages/Layout/DashboardLayout.vue";

import Start from "../pages/Start.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/start",
    children: [
      {
        path: "start",
        name: "Start",
        component: Start
      }
    ]
  }
];

export default routes;
