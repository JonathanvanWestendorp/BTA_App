<template>
  <div class="main">
    <div v-if="callData" class="function-calls">
      <h2>Function Calls</h2>
      <div class="btn-container" v-for="(elem, idx) in callData" :key="idx">
        <button class="btn" @click="expand(idx)">
          {{ elem.timestamp }}
          {{ elem.rpcResponse ? elem.rpcResponse.transactionHash : null }}
        </button>
        <div class="expandable" :id="`func-data-${idx}`" style="display: none;">
          <h4>Call</h4>
          <ul>
            <li class="elem-timestamp">Timestamp: {{ elem.timestamp }}</li>
            <li class="elem-chainId">
              Blockchain framework: {{ elem.chainId }}
            </li>
            <li class="elem-contractAddress">
              Address: {{ elem.contractAddress }}
            </li>
            <li class="elem-contractName">Contract: {{ elem.contractName }}</li>
            <li class="elem-functionName">Function: {{ elem.functionName }}</li>
            <li class="elem-input">Input: {{ elem.input }}</li>
            <li class="elem-rpcPort">RPC port: {{ elem.rpcPort }}</li>
            <li class="elem-duration">Duration: {{ elem.duration }} ms</li>
          </ul>
          <h4>Response</h4>
          <div v-if="elem.rpcResponse">
            <ul class="elem-rpcResponse-data">
              <li class="elem-rpcResponse-gasUsed">
                Gas used: {{ elem.rpcResponse.gasUsed }}
              </li>
              <li class="elem-rpcResponse-cumulativeGasUsed">
                Cumulative gas used: {{ elem.rpcResponse.cumulativeGasUsed }}
              </li>
              <li class="elem-rpcResponse-from">
                From: {{ elem.rpcResponse.from }}
              </li>
              <li class="elem-rpcResponse-to">To: {{ elem.rpcResponse.to }}</li>
              <li class="elem-rpcResponse-status">
                Status: {{ elem.rpcResponse.status }}
              </li>
            </ul>
          </div>
          <div v-else>
            <i
              >The rpc apparently didn't return anything useful. Please check
              Contract code or input for errors.</i
            >
          </div>
          <h4>Logs</h4>
          <ul
            v-if="elem.rpcResponse && elem.rpcResponse.logs"
            class="elem-rpcResponse-logs-items"
          >
            <li
              class="elem-rpcResponse-logs-item"
              v-for="(value, item, idx_l) in elem.rpcResponse.logs[0]"
              :key="idx_l"
            >
              {{
                item === "data"
                  ? `${item}: ${value}\nDecoded: ${decodeHex(value)}`
                  : `${item}: ${value}`
              }}
            </li>
          </ul>
          <div v-else>
            <i
              >It seems there are no logs for this call. Please check the
              Contract events if this wasn't expected.</i
            >
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
      apiEndpoints: [":4500/calls"],
      callData: null
    };
  },
  mounted() {
    this.getCalls();
  },
  methods: {
    getCalls() {
      let self = this;
      const endpoint = `http://${this.network}${this.apiEndpoints[0]}`;
      axios.get(endpoint).then(function(res) {
        self.callData = res.data;
      });
    },
    expand(idx) {
      let data = document.getElementById(`func-data-${idx}`);
      if (data.getAttribute("style") === "display: block;") {
        data.setAttribute("style", "display: none;");
      } else {
        data.setAttribute("style", "display: block;");
      }
    },
    decodeHex(hex) {
      let str = "";
      for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(
          parseInt(hex.replace("0x", "").substr(n, 2), 16)
        );
      }
      return str.trim();
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
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
  width: 100%;
  font-size: 14px;
}
.btn:hover {
  background: #434343;
  letter-spacing: 1px;
  -webkit-box-shadow: 0 5px 40px -10px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0 5px 40px -10px rgba(0, 0, 0, 0.57);
  box-shadow: 5px 40px 10px rgba(0, 0, 0, 0.57);
  transition: all 0.4s ease 0s;
}
.elem-rpcResponse-logs-item {
  word-wrap: break-word;
}
</style>
