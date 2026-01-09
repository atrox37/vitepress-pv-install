---
layout: false
---

<script setup>
import VideoLibrary from '../.vitepress/theme/VideoLibrary.vue'
</script>

<VideoLibrary />

<style>
/* Hide VitePress default navigation */
:global(.VPNav),
:global(.VPNavBar),
:global(.VPSidebar),
:global(.VPContent) {
  display: none !important;
}

/* Full page layout */
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
