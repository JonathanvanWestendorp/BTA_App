<template>
  <div class="main">
    <div class="fileInput">
      <form id="contract-form" v-on:submit="compile()">
        <input
          type="file"
          id="contract"
          ref="contractFile"
          v-on:change="handleFile()"
        />
        <input type="checkbox" id="deployed" v-model="checked" />
        <label for="deployed">Contract already active</label>
        <input
          v-if="checked"
          type="text"
          id="contractAddress"
          placeholder="Contract Address"
          v-model="contractAddress"
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
    <div v-if="resContracts" class="functions-wrapper">
      <div class="files" v-for="(filename, idx_0) in resContracts" :key="idx_0">
        <div
          class="contract"
          v-for="(contract, idx_1) in Object.keys(filename)"
          :key="idx_1"
        >
          <h2>{{ contract }}</h2>
          <div
            class="function"
            v-for="(func, idx_2) in filename[contract].abi"
            :key="idx_2"
          >
            <form
              v-if="func.type === 'function'"
              :id="func.name"
              :action="'http://' + network + apiEndpoints[1]"
              method="post"
            >
              <input
                type="text"
                name="params"
                :placeholder="funcData[func.name].placeholder"
              />
              <input
                type="hidden"
                name="paramTypes"
                :value="funcData[func.name].types"
              />
              <input
                type="hidden"
                name="contractAddress"
                :value="contractAddress"
              />
              <input type="submit" name="functionName" :value="func.name" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      network: window.location.hostname,
      apiEndpoints: [":3000/compile", ":3000/execute", ":3000/deploy"],
      contractFile: null,
      contractAddress: null,
      checked: false,
      resContracts: null,
      funcData: {}
    };
  },
  methods: {
    compile() {
      let self = this;
      const endpoint = `http://${this.network}${this.apiEndpoints[0]}`;
      let contractData = new FormData();
      contractData.append("contract", this.contractFile);
      axios
        .post(endpoint, contractData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function(res) {
          const resContracts = res.data.contracts;
          console.log(resContracts);
          for (const filename of Object.keys(resContracts)) {
            for (const contract of Object.keys(resContracts[filename])) {
              const abi = resContracts[filename][contract].abi;
              for (const func of Object.keys(abi)) {
                if (abi[func].type === "function") {
                  let types = [];
                  let placeholder = [];
                  for (const input of abi[func].inputs) {
                    types.push(input.internalType);
                    placeholder.push(
                      [input.internalType, input.name].join(" ")
                    );
                  }
                  self.funcData[abi[func].name] = { types: types };
                  self.funcData[abi[func].name] = { placeholder: placeholder };
                }
              }
            }
          }
          self.resContracts = resContracts;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    handleFile() {
      this.contractFile = this.$refs.contractFile.files[0];
    }
  }
};
</script>
