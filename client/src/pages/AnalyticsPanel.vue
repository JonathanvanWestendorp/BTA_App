<template>
  <div class="container">
    <router-link to="/results">Back to overview -></router-link>
    <div v-if="simulation" class="analytics-main">
      <h2>{{ simulation.name }} - Analytics</h2>
      <div class="timing-chart">
        <JSCharting :options="timeChartOptions"></JSCharting>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import JSCharting from "jscharting-vue";

export default {
  name: "AnalyticsPanel",
  data() {
    return {
      network: "localhost",
      simulation: null,
      userTasks: {},
      events: [],
      timeChartOptions: {
        title: { label: { text: "User task Timing" } },
        type: "line spline",
        yAxis_label_text: "Time (ms)",
        legend_position: "bottom right",
        xAxis_scale_type: "number",
        series: []
      }
    };
  },
  components: {
    JSCharting
  },
  mounted() {
    let _this = this;
    const endpoint = `http://${this.network}:4500/simulation`;
    axios
      .get(endpoint, {
        data: {
          id: this.$route.query.id
        }
      })
      .then(function(res) {
        _this.simulation = res.data[0];
        for (const singleSim of _this.simulation.simulations) {
          for (const userTask of singleSim.userTasks) {
            if (!_this.userTasks[userTask.taskId]) {
              _this.userTasks[userTask.taskId] = [];
            }
            _this.userTasks[userTask.taskId].push({
              x: _this.userTasks[userTask.taskId].length,
              y: userTask.duration
            });
            for (const log of userTask.receipt[0].logs) {
              _this.events.push(log);
            }
          }
        }
        for (const userTask of Object.keys(_this.userTasks)) {
          _this.timeChartOptions.series.push({
            name: userTask,
            points: _this.userTasks[userTask]
          });
        }
      });
  }
};
</script>

<style scoped>
.container {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
