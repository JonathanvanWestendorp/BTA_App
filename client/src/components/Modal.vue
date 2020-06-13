<template>
  <div class="modal">
    <div class="container">
      <div class="modal_title">Sample Testing {{ workItem }}</div>
      <label for="main-select">Choose sampling method</label>
      <select id="main-select" v-model="selected">
        <option disabled value="">Please select one</option>
        <option>Random</option>
        <option>Another distribution</option>
        <option>Yet another distribution</option>
      </select>
      <div v-if="selected === 'Random'">
        <label for="low">Low</label>
        <input type="number" id="low" v-model="methodRandom.low" />
        <label for="high">High</label>
        <input type="number" id="high" v-model="methodRandom.high" />
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
        low: null,
        high: null
      }
    };
  },
  props: {
    workItem: String,
    idx: Number
  },
  methods: {
    passMethodInput() {
      if (this.selected === "Random") {
        this.$parent.userTasks[this.workItem][this.idx][
          "sampleMethod"
        ] = this.methodRandom;
      } //else if () {
      //
      // }
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
  width: 80%;
}
</style>
