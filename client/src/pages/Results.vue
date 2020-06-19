<template>
  <div class="main">
    <h2>Click to view..</h2>
    <div
      class="simulation-container"
      v-for="(simulation, idx) in simulations"
      :key="idx"
    >
      <hr />
      <router-link :to="'/analyticspanel?id=' + simulation._id">
        <h3>Simulation #{{ idx + 1 }}: {{ simulation.name }}</h3>
      </router-link>
      <b>{{ simulation.timestamp.split("T")[0] }}</b>
      -- <b>{{ simulation.timestamp.split("T")[1].split(".")[0] }}</b>
      <a class="delete" @click="deleteSimulation(simulation)"></a>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Results",
  data() {
    return {
      network: "localhost",
      simulations: null,
      currentSimulation: null
    };
  },
  mounted() {
    this.getSimulations();
  },
  methods: {
    getSimulations() {
      let _this = this;
      const endpoint = `http://${this.network}:4500/simulation`;
      axios.get(endpoint).then(function(res) {
        _this.simulations = res.data;
      });
    },
    deleteSimulation(simulation) {
      let _this = this;
      const endpoint = `http://${this.network}:4500/simulation`;
      axios
        .delete(endpoint, {
          data: {
            id: simulation._id
          }
        })
        .then(function(res) {
          _this.simulations = res.data;
        });
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
.simulation-container {
  text-align: center;
}
.simulation-container:hover {
  background: #ffffff;
  cursor: pointer;
}
.delete {
  display: flex;
  width: 115px;
  height: 25px;
  background-color: darkred;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
  z-index: 100;
}
</style>
