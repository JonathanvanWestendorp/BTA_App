import * as random from "./randomNormal";
import axios from "axios";

class Simulator {
  constructor(userTasks, modelName, canvas) {
    this.canvas = canvas;
    this.userTasks = userTasks;
    this.modelName = modelName;
    this.previousState = null;
    this.instanceAddress = "";
    this.data = [];
  }

  async simulate() {
    await this.createInstance();
    await this.simulateInstance();
    return this.data;
  }

  async createInstance() {
    const res = await axios.post(
      `http://localhost:3000/models/${this.modelName}`
    );
    this.instanceAddress = res.data.address;
  }

  async simulateInstance() {
    if (this.instanceAddress) {
      while (true) {
        const state = await this.getState();
        if (state.workItems.length > 0) {
          this.renderState(state);
          if (state.workItems[0].input.length !== 0) {
            let parameters = [];
            const taskId = state.workItems[0].elementId;
            const userTask = this.userTasks[taskId];
            for (const input of userTask) {
              parameters.push(
                input.sampleTest
                  ? this.randomValue(input.sampleMethod)
                  : input.value.toString()
              );
            }
            const t0 = performance.now();
            const receipt = await this.executeWorkitem(
              taskId,
              parameters,
              state.workItems[0].hrefs[0]
            );
            const t1 = performance.now();
            this.data.push({
              taskId: taskId,
              input: parameters,
              duration: t1 - t0,
              receipt: receipt.data
            });
          }
        } else {
          break;
        }
      }
    } else {
      console.log("No instance to Simulate");
    }
  }

  async getState() {
    const res = await axios.get(
      `http://localhost:3000/processes/${this.instanceAddress}`
    );
    return res.data;
  }

  async executeWorkitem(taskId, parameters, href) {
    return await axios.post(`http://localhost:3000${href}`, {
      elementId: taskId,
      inputParameters: parameters
    });
  }

  randomValue(method) {
    if (method.name === "Random") {
      return Math.floor(Math.random() * (method.min - method.max) + method.min);
    } else if (method.name === "Gaussian") {
      return Math.floor(
        random.randomSkewNormal(
          parseInt(method.loc),
          parseInt(method.scale),
          parseInt(method.shape)
        )
      ).toString();
    } else if (method.name === "Binomial") {
      return Math.random() <= method.p;
    }
  }

  renderState(state) {
    if (this.previousState) {
      this.previousState.workItems.forEach(workItem => {
        this.canvas.removeMarker(workItem.elementId, "highlight");
        this.canvas.removeMarker(workItem.elementId, "highlight-running");
      });
      this.previousState.externalItemGroupList.forEach(workItem => {
        this.canvas.removeMarker(workItem.elementId, "highlight-external");
      });
    }
    state.workItems.forEach(workItem => {
      if (workItem.status.indexOf("started") >= 0) {
        this.canvas.addMarker(workItem.elementId, "highlight");
      } else {
        this.canvas.addMarker(workItem.elementId, "highlight-running");
      }
    });
    state.externalItemGroupList.forEach(externalItemGroup => {
      if (externalItemGroup.status.indexOf("started") >= 0) {
        this.canvas.addMarker(
          externalItemGroup.elementId,
          "highlight-external"
        );
      }
    });
    this.previousState = state;
  }
}
export default Simulator;
