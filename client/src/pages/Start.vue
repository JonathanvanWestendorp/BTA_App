<template>
  <div class="main">
    <div class="rpc-availability">
      <h4>Enter RPC port</h4>
      <input
        type="number"
        v-model="rpcPort"
        placeholder="Enter rpc port"
        @input="checkAvailable()"
        min="1000"
        max="9999"
      />
      <p v-if="rpcAvailable">port {{ rpcPort }} is available!</p>
      <p v-else>port {{ rpcPort }} is <i>not</i> available</p>
    </div>
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
              @submit.prevent="
                execute(
                  funcInput[func.name],
                  funcData[func.name].types,
                  func.name,
                  contractAddress,
                  rpcPort
                )
              "
            >
              <input
                type="text"
                name="params"
                :placeholder="funcData[func.name].placeholder"
                v-model="funcInput[func.name]"
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
      rpcPort: "",
      apiEndpoints: [":3000/compile", ":3000/execute", ":3000/deploy"],
      rpcAvailable: false,
      contractFile: null,
      contractAddress: null,
      checked: false,
      resContracts: null,
      funcData: {},
      funcInput: {},
      funcOutput: {}
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
                  self.funcData[abi[func].name] = {
                    types: types,
                    placeholder: placeholder
                  };
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
    execute(input, types, name, address, port) {
      let self = this;
      const data = {
        input: input,
        types: types,
        name: name,
        address: address,
        port: port
      };
      const endpoint = `http://${this.network}${this.apiEndpoints[1]}`;
      axios
        .post(endpoint, data, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(function(res) {
          console.log(res);
          self.funcOutput[name] = [];
          self.funcOutput[name].push({ timestamp: res });
        });
    },
    async deploy(contractName, byteCode) {
      let self = this;
      const endpoint = `http://${this.network}${this.apiEndpoints[2]}`;
      axios
        .post(endpoint, {
          byteCode: byteCode
        })
        .then(function(res) {
          self.contractAddress = res.data;
        });
    },
    checkAvailable() {
      let self = this;
      const endpoint = `http://${this.network}:${this.rpcPort}`;
      if (this.rpcPort.length > 3) {
        axios
          .post(endpoint, {}, { timeout: 500 })
          .then(function(res) {
            if (res.status === 200) {
              self.rpcAvailable = true;
            }
          })
          .catch(function(err) {
            if (err.code === "ECONNABORTED") {
              self.rpcAvailable = false;
            }
          });
      }
    },
    handleFile() {
      this.contractFile = this.$refs.contractFile.files[0];
    }
  }
};
</script>
