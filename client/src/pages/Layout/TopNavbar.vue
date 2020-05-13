<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">
          <b>{{ $route.name }}</b>
        </h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <md-list-item href="#/start">
              <i class="material-icons">trip_origin</i>
              <p class="hidden-lg hidden-md">Start</p>
            </md-list-item>
            <md-list-item @click="clearSesh()">
              <i class="material-icons">clear</i>
              <p class="hidden-lg hidden-md">Clear</p>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    clearSesh() {
      if (this.$session.exists()) {
        this.$session.destroy();
      }
      location.reload();
    }
  }
};
</script>

<style lang="css"></style>
