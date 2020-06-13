<template>
  <div class="main">
    <div class="iframe-loading" v-if="iframeLoading">
      iframe loading...
    </div>
    <div class="iframe-wrapper">
      <vue-friendly-iframe
        ref="iframeEl"
        :style="{ display: iframeLoading ? 'none' : 'block' }"
        :src="Caterpillar.src"
        @load="onLoad"
        @iframe-load="onIframeLoad"
        frameborder="0"
        gesture="media"
        allow="encrypted-media"
        height="100%"
      ></vue-friendly-iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "BusinessProcess",
  data() {
    return {
      Caterpillar: {
        src: "http://localhost:3200"
      },
      iframeLoading: true
    };
  },
  methods: {
    onLoad() {
      console.log("iframe loaded");
      this.iframeLoading = false;
    },
    onIframeLoad() {
      console.log("iframe loaded");
    }
  }
};
</script>

<style lang="less">
html {
  overflow: auto;
}
.wrapper {
  height: 100%;
  width: 100%;
  position: absolute;
}

.main-panel {
  height: 100%;
  position: absolute;
}
iframe {
  height: 100%;
  position: absolute;
}
.iframe-wrapper {
  border: 1px solid gray;
  height: 600px;
  .vue-friendly-iframe {
    height: 100%;
    width: 100%;
    iframe {
      height: 100%;
      width: 100%;
      display: block;
      border: none;
      overflow-x: hidden;
    }
  }
}
</style>
