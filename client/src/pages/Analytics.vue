<template>
  <div class="analytics-main">
    <div class="menu-container">
      <button @click="toggleShow" class="anchor">
        {{ placeholder }}
      </button>
      <div v-if="showMenu" class="menu">
        <div
          class="menu-item"
          v-for="(modelName, idx) in Object.keys(models)"
          @click="getToolKit(modelName)"
          :key="idx"
        >
          {{ modelName }}
        </div>
      </div>
    </div>
    <div id="bpmn" class="bpmn" />
    <h3 v-if="Object.keys(userTasks).length > 0">
      Please fill in the desired input parameters for each user task
    </h3>
    <div v-if="Object.keys(userTasks).length > 0" class="model-inputs">
      <div
        v-for="(taskId, idx_0) in Object.keys(userTasks)"
        class="input-form"
        :key="idx_0"
      >
        <b>{{ taskId }}</b>
        <form :id="taskId">
          <div
            v-for="(input, idx_1) in userTasks[taskId]"
            :key="idx_1"
            class="input-param"
          >
            <p>{{ input.input }}</p>
            <input
              :id="`field-${taskId}${idx_1}`"
              :type="input.inputType"
              v-model="userTasks[taskId][idx_1].value"
              :disabled="userTasks[taskId][idx_1].sampleTest"
            />
            <input
              :id="`sample-test-${taskId}${idx_1}`"
              type="checkbox"
              v-model="userTasks[taskId][idx_1].sampleTest"
              @click="
                openModal(
                  userTasks[taskId][idx_1].sampleTest,
                  taskId,
                  userTasks[taskId][idx_1].inputType,
                  idx_1
                )
              "
            />
            <label :for="`sample-test-${taskId}${idx_1}`">Vary</label>
          </div>
        </form>
      </div>
      <div v-if="modalOpen" class="modal-container">
        <modal
          :work-item="modalItem"
          :work-item-type="modalType"
          :idx="modalIdx"
        />
      </div>
    </div>
    <div v-if="Object.keys(userTasks).length > 0">
      <div class="simulation-form-container">
        <form class="simulation-form">
          <input
            type="button"
            id="start-simulation"
            @click="simulate"
            value="Start Simulation"
          />
          <select v-model="frequency">
            <option>1</option>
            <option>10</option>
            <option>100</option>
            <option>500</option>
          </select>
        </form>
      </div>
      <div v-if="frequency > 0" class="progress-circle">
        <VueCircle
          ref="circleId"
          :progress="0"
          :size="200"
          :reverse="false"
          line-cap="round"
          :fill="{ color: '#4caf50' }"
          empty-fill="rgba(0, 0, 0, .1)"
          :animation-start-value="0.0"
          :start-angle="0"
          insert-mode="append"
          :thickness="10"
          :show-percent="true"
        >
        </VueCircle>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Bpmnjs from "bpmn-js";
import xmlHelper from "./js/xmlHelper";
import Simulator from "./js/Simulator";
import Modal from "../components/Modal";
import VueCircle from "vue2-circle-progress/src/index.vue";

export default {
  data() {
    return {
      network: "localhost",
      viewer: null,
      canvas: null,
      models: {},
      userTasks: {},
      placeholder: "Select Business Process Model",
      showMenu: false,
      modalOpen: false,
      modalItem: null,
      modalType: null,
      modalIdx: null,
      frequency: 0
    };
  },
  mounted() {
    this.getModels();
    this.viewer = new Bpmnjs({
      container: "#bpmn"
    });
    this.canvas = this.viewer.get("canvas");
    this.canvas.zoom("fit-viewport");
  },
  components: {
    Modal,
    VueCircle
  },
  methods: {
    getModels() {
      let self = this;
      const endpoint = `http://${this.network}:3000/models`;
      axios.get(endpoint).then(function(res) {
        for (const model of res.data) {
          self.models[model.id] = model;
        }
      });
    },
    toggleShow() {
      this.showMenu = !this.showMenu;
    },
    getToolKit(modelName) {
      this.userTasks = {};
      this.placeholder = modelName;
      this.toggleShow();
      const bpm = this.models[modelName]["bpmn"];
      this.viewer.importXML(bpm);
      const parser = new DOMParser();
      const xml = parser.parseFromString(bpm, "text/xml");
      const obj = xmlHelper.xmlToJson(xml);
      const userTasks =
        obj["bpmn:definitions"]["bpmn:process"]["bpmn:userTask"];
      for (const userTaskIndex in userTasks) {
        const userTask = userTasks[userTaskIndex];
        const parsedCdata = userTask["bpmn:documentation"][
          "#cdata-section"
        ].split(":")[0];
        const inputTypes = parsedCdata.match(/(?<= )\w+(?= )|(?<=\()\w+(?= )/g);
        const inputs = parsedCdata.match(/\w+(?=,)|\w+(?=\))/g);
        const userTaskId = userTask["@attributes"]["id"];
        this.userTasks[userTaskId] = [];
        for (let i = 0; i < inputs.length; i++) {
          switch (inputTypes[i]) {
            case "uint":
              this.userTasks[userTaskId].push({
                inputType: "number",
                input: inputs[i],
                value: "",
                sampleTest: false,
                sampleMethod: {}
              });
              break;
            case "bool":
              this.userTasks[userTaskId].push({
                inputType: "checkbox",
                input: inputs[i],
                value: "",
                sampleTest: false,
                sampleMethod: {}
              });
              break;
            case "string":
              this.userTasks[userTaskId].push({
                inputType: "text",
                input: inputs[i],
                value: "",
                sampleTest: false,
                sampleMethod: {}
              });
              break;
            case "address":
              this.userTasks[userTaskId].push({
                inputType: "text",
                input: inputs[i],
                value: "",
                sampleTest: false,
                sampleMethod: {}
              });
              break;
          }
        }
      }
    },
    async simulate() {
      if (this.inputComplete()) {
        let simulationResult = {};
        let singleSims = [];
        const t0 = performance.now();
        for (let i = 0; i < this.frequency; i++) {
          const singleSim = { userTasks: [] };
          this.simulator = new Simulator(
            this.userTasks,
            this.placeholder,
            this.canvas
          );
          singleSim.userTasks = await this.simulator.simulate();
          singleSims.push(singleSim);
          console.log(`instance ${i + 1} simulated`);
          this.$refs.circleId.updateProgress(
            Math.floor(((i + 1) / this.frequency) * 100)
          );
        }
        const t1 = performance.now();
        this.simulationEnd();
        simulationResult = {
          simulations: singleSims,
          timestamp: Date.now,
          iterations: this.frequency,
          duration: t1 - t0
        };
      }
    },
    inputComplete() {
      for (const task in this.userTasks) {
        for (const input of this.userTasks[task]) {
          if (!(input.value !== "" || input.sampleTest)) {
            return false;
          }
        }
      }
      return true;
    },
    openModal(checked, item, type, idx) {
      if (checked) {
        this.userTasks[item][idx].sampleTest = false;
        this.userTasks[item][idx].sampleMethod = {};
        document.getElementById(`field-${item}${idx}`).disabled = false;
        document.getElementById(`field-${item}${idx}`).placeholder = "";
        return;
      }
      this.modalItem = item;
      this.modalType = type;
      this.modalIdx = idx;
      this.toggleModal();
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    simulationEnd() {
      console.log("Done! Please see the results on the 'results' tab.");
    }
  }
};
</script>

<style scoped>
.anchor {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #fff;
  background-color: #27ae60;
  border-color: #27ae60;
}

.anchor::after {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.5em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.28em solid transparent;
  border-bottom: 0;
  border-left: 0.28em solid transparent;
}

.anchor:hover {
  color: #fff;
  background-color: #229954;
  border-color: #229954;
  cursor: pointer;
}

.menu {
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  color: #212529;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  list-style: none;
  margin: 0.125rem 0 0;
  padding: 0.5rem 0;
  position: absolute;
  text-align: left;
  z-index: 100;
}

.menu-item {
  color: #212529;
  padding: 0.25rem 1.5rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.menu-item:hover {
  background-color: #f4f6f6;
  cursor: pointer;
}

.model-inputs {
  padding-top: 20px;
  display: table;
  width: 100%;
  table-layout: fixed;
}
.input-form {
  margin: auto;
  border: 5px solid #212121;
  display: table-cell;
  text-align: center;
  background-color: #4caf50;
}
.input-form b {
  border-bottom: 1px solid black;
  padding: 5px 0 0 0;
}
.input-param {
  padding: 0 0 10px 0;
}
.bpmn {
  height: 450px;
}
.progress-circle {
  display: inline-block;
}
.modal-container {
  width: 0;
  height: 0;
}
</style>
