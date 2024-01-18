<script setup lang="ts">
import ToolPanel from "@/components/ToolPanel/ToolPanel.vue";
</script>

<template>
  <div>
    <ToolPanel />
    <RouterView />
  </div>
</template>

<style>
body,
html {
  overflow: hidden;
}
</style>
