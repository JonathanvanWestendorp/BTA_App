<template>
  <div class="main">
    <div class="starting-point">
      <input
        type="button"
        value="Start from business process model!"
        @click="businessModel()"
      />
      <input
        type="button"
        value="Start from solidity!"
        @click="solidity = true"
      />
    </div>
    <div v-if="solidity" class="solidity-wrapper">
      <div class="rpc-availability">
        <h4>Enter RPC port</h4>
        <input
          type="number"
          v-model="rpcPort"
          placeholder="Enter rpc port"
          class="port-input"
          @input="checkAvailable()"
        />
        <div v-if="rpcPort" class="port-info">
          <p v-if="rpcAvailable" class="port-info-text">
            port <b>{{ rpcPort }}</b> is available!
          </p>
          <p v-else class="port-info-text">
            port <b>{{ rpcPort }}</b> is <i>not</i> available, check rpc
            configuration
          </p>
        </div>
      </div>
      <div class="fileInput">
        <form id="contract-form" v-on:submit="compile()">
          <input
            type="file"
            id="contract"
            ref="contractFile"
            v-on:change="handleFile()"
            class="inputfile btn"
          />
          <label v-if="contractFilename" for="contract">{{
            contractFilename
          }}</label>
          <label v-else for="contract">Choose .sol file</label>
          <input type="checkbox" id="deployed" v-model="checked" />
          <label for="deployed">Contract already active</label>
          <input
            v-if="checked"
            type="text"
            id="contractAddress"
            placeholder="Contract Address"
            v-model="contractAddress"
          />
          <input type="submit" value="Submit" class="btn" />
          <img
            v-if="loading"
            class="loader"
            src="../assets/svg/loader.svg"
            alt=""
          />
        </form>
      </div>
      <div v-if="contractAddress" class="compilation-wrapper">
        <p>Smart Contract deployed at: {{ contractAddress }}</p>
        <div v-if="resContracts" class="functions-wrapper">
          <div
            class="files"
            v-for="(filename, idx_0) in resContracts"
            :key="idx_0"
          >
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
                      contract,
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
                  <input
                    type="submit"
                    name="functionName"
                    :value="func.name"
                    class="btn"
                  />
                </form>
              </div>
            </div>
          </div>
          <p v-if="lastDuration">Execution time: {{ lastDuration }} ms</p>
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
      apiEndpoints: [
        ":4500/compile",
        ":4500/execute",
        ":4500/deploy",
        ":4500/calls"
      ],
      solidity: false,
      rpcAvailable: false,
      contractFile: null,
      contractFilename: "",
      contractAddress: null,
      checked: false,
      resContracts: null,
      funcData: {},
      funcInput: {},
      lastDuration: null,
      loading: false
    };
  },
  mounted() {
    if (this.$session.exists()) {
      Object.assign(this.$data, this.$session.get("data"));
    } else {
      this.$session.set("data", this.$data);
    }
  },
  watch: {
    $data: {
      handler() {
        this.$session.set("data", this.$data);
      },
      deep: true
    }
  },
  methods: {
    compile() {
      let self = this;
      this.loading = true;
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
          if (!res.data.contracts) {
            alert(
              "Error, contract couldn't be deployed: " +
                res.data.errors[0].message
            );
            this.loading = false;
            return;
          }
          const resContracts = res.data.contracts;
          for (const filename of Object.keys(resContracts)) {
            for (const contract of Object.keys(resContracts[filename])) {
              const abi = resContracts[filename][contract].abi;
              if (!self.checked) {
                const byteCode =
                  resContracts[filename][contract].evm.bytecode.object;
                self.deploy(byteCode);
              }
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
          if (self.contractAddress) {
            self.loading = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          this.loading = false;
        });
    },
    execute(contractName, input, types, name, address, port) {
      let self = this;
      this.loading = true;
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
          if (res.data.error) {
            alert("Error in transaction handler: " + res.data.error);
            this.loading = false;
            return;
          }
          self.lastDuration = res.data.duration;
          axios
            .post(
              `http://${self.network}${self.apiEndpoints[3]}`,
              {
                timestamp: res.data.timestamp,
                chainId: "Fabric",
                contractAddress: self.contractAddress,
                contractName: contractName,
                functionName: name,
                input: input,
                rpcResponse: res.data.rpcResponse,
                rpcPort: port,
                duration: res.data.duration
              },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            )
            .then(function(res) {
              console.log(res.status);
              self.loading = false;
            })
            .catch(function(err) {
              console.log(err);
              self.loading = false;
            });
        })
        .catch(function(err) {
          alert("Error in transaction handler: " + err);
          this.loading = false;
        });
    },
    deploy(byteCode) {
      let self = this;
      this.loading = true;
      const endpoint = `http://${this.network}${this.apiEndpoints[2]}`;
      axios
        .post(
          endpoint,
          {
            byteCode: byteCode,
            rpcPort: self.rpcPort
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(function(res) {
          self.contractAddress = res.data;
          self.loading = false;
        });
    },
    businessModel() {
      this.$router.push('bpm');
    },
    checkAvailable() {
      let self = this;
      const endpoint = `http://${this.network}:${this.rpcPort}`;
      if (this.rpcPort.length === 4) {
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
      } else {
        this.rpcAvailable = false;
      }
    },
    handleFile() {
      this.contractFile = this.$refs.contractFile.files[0];
      this.contractFilename = this.contractFile.name;
    }
  }
};
</script>
<style>
.btn {
  color: #fff !important;
  text-transform: uppercase;
  text-decoration: none;
  background: #4caf50;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;
}
.btn:hover {
  background: #434343;
  letter-spacing: 1px;
  -webkit-box-shadow: 0 5px 40px -10px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0 5px 40px -10px rgba(0, 0, 0, 0.57);
  box-shadow: 5px 40px 10px rgba(0, 0, 0, 0.57);
  transition: all 0.4s ease 0s;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + label {
  color: #fff !important;
  text-transform: uppercase;
  text-decoration: none;
  background: #4caf50;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;
  cursor: pointer;
}

.inputfile:focus + label,
.inputfile + label:hover {
  background: #434343;
  letter-spacing: 1px;
  -webkit-box-shadow: 0 5px 40px -10px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0 5px 40px -10px rgba(0, 0, 0, 0.57);
  box-shadow: 5px 40px 10px rgba(0, 0, 0, 0.57);
  transition: all 0.4s ease 0s;
}
.rpc-availability {
  margin-bottom: 20px;
  margin-right: 10px;
}
.port-info {
  display: inline-block;
}
.loader {
  display: inline-block;
}
</style>
