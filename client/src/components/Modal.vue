<template>
  <div class="modal">
    <div class="container">
      <div class="modal-title">
        <b>Sample Testing {{ workItem }}</b>
      </div>
      <div class="select-container">
        <label for="main-select">Choose sampling method</label>
        <select id="main-select" v-model="selected">
          <option disabled value="">Please select one</option>
          <option v-if="workItemType === 'number'">Random</option>
          <option v-if="workItemType === 'number'">Gaussian</option>
          <option v-else-if="workItemType === 'checkbox'">Binomial</option>
        </select>
      </div>
      <div class="parameter-container">
        <div v-if="selected === 'Random'">
          <label for="low">Low</label>
          <br />
          <input type="number" id="low" v-model="methodRandom.low" />
          <br />
          <label for="high">High</label>
          <br />
          <input type="number" id="high" v-model="methodRandom.high" />
        </div>
        <div v-else-if="selected === 'Gaussian'">
          <label for="loc">Mean</label>
          <br />
          <input type="number" id="loc" v-model="methodGaussian.loc" />
          <br />
          <label for="scale">Std. deviation</label>
          <br />
          <input type="number" id="scale" v-model="methodGaussian.scale" />
          <br />
          <label for="shape">Skewness</label>
          <br />
          <input type="number" id="shape" v-model="methodGaussian.shape" />
        </div>
        <div v-else-if="selected === 'Binomial'">
          <label for="p">Pr(True)</label>
          <br />
          <input type="number" id="p" v-model="methodBinomial.p" />
        </div>
      </div>
      <button
        class="mt-3 border-b border-teal font-semibold"
        @click="passMethodInput"
      >
        Enter
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      selected: "",
      methodRandom: {
        name: "Random",
        low: 0,
        high: 0
      },
      methodGaussian: {
        name: "Gaussian",
        loc: 0,
        scale: 0,
        shape: 0
      },
      methodBinomial: {
        name: "Binomial",
        p: 0
      }
    };
  },
  props: {
    workItem: String,
    workItemType: String,
    idx: Number
  },
  methods: {
    passMethodInput() {
      if (this.selected === "Random") {
        this.$parent.userTasks[this.workItem][this.idx][
          "sampleMethod"
        ] = this.methodRandom;
      } else if (this.selected === "Gaussian") {
        this.$parent.userTasks[this.workItem][this.idx][
          "sampleMethod"
        ] = this.methodGaussian;
      } else if (this.selected === "Binomial") {
        this.$parent.userTasks[this.workItem][this.idx][
          "sampleMethod"
        ] = this.methodBinomial;
      } else {
        document.getElementById(
          `sample-test-${this.workItem}${this.idx}`
        ).checked = false;
        this.$parent.toggleModal();
        return;
      }
      document.getElementById(
        `field-${this.workItem}${this.idx}`
      ).placeholder = this.selected;
      this.$parent.toggleModal();
    }
  }
};
</script>

<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.container {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}
.modal-title {
  padding: 10px;
}
.parameter-container {
  display: table;
}
</style>
