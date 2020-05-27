import DashboardLayout from "../pages/Layout/DashboardLayout.vue";

import Info from "../pages/Info.vue";
import Start from "../pages/Start.vue";
import BusinessModel from "../pages/BusinessModel.vue";
import Data from "../pages/Data.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/start",
    children: [
      {
        path: "info",
        name: "Info",
        component: Info
      },
      {
        path: "start",
        name: "Start",
        component: Start
      },
      {
        path: "bpm",
        name: "BusinessModel",
        component: BusinessModel
      },
      {
        path: "data",
        name: "Data",
        component: Data
      }
    ]
  }
];

export default routes;
