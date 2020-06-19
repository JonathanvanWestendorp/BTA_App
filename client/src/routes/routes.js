import DashboardLayout from "../pages/Layout/DashboardLayout.vue";

import Info from "../pages/Info.vue";
import Start from "../pages/Start.vue";
import Data from "../pages/Data.vue";
import BusinessModel from "../pages/BusinessModel.vue";
import Analytics from "../pages/Analytics.vue";
import Results from "../pages/Results";
import AnalyticsPanel from "../pages/AnalyticsPanel";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/info",
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
        path: "data",
        name: "Data",
        component: Data
      },
      {
        path: "bpm",
        name: "BusinessModel",
        component: BusinessModel
      },
      {
        path: "analytics",
        name: "Analytics",
        component: Analytics
      },
      {
        path: "results",
        name: "Results",
        component: Results
      },
      {
        path: "analyticspanel",
        name: "AnalyticsPanel",
        component: AnalyticsPanel
      }
    ]
  }
];

export default routes;
