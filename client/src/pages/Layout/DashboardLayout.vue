<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/info">
        <md-icon>info</md-icon>
        <p>Info</p>
      </sidebar-link>
      <sidebar-link to="/start">
        <md-icon>trip_origin</md-icon>
        <p>Start</p>
      </sidebar-link>
      <sidebar-link to="/data">
        <md-icon>data_usage</md-icon>
        <p>Transactions</p>
      </sidebar-link>
      <sidebar-link to="/bpm">
        <md-icon>business_center</md-icon>
        <p>Caterpillar</p>
      </sidebar-link>
      <sidebar-link to="/analytics">
        <md-icon>analytics</md-icon>
        <p>Simulate</p>
      </sidebar-link>
      <sidebar-link to="/results">
        <md-icon>science</md-icon>
        <p>Results</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
import FixedPlugin from "./Extra/FixedPlugin.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
    FixedPlugin
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("../../assets/img/sidebar-2.jpg")
    };
  }
};
</script>
