<template>
  <div class="__tool-panel-section rounded-[3px]">
    <div>
      <div
        class="p-3 hover:bg-gray-700 cursor-pointer"
        @click="selectTool('free-pan')"
        :class="{
          'bg-gray-700': toolPanelStore.currentTool === 'free-pan',
        }"
      >
        <PhHandGrabbing :size="18" />
      </div>
      <div
        class="p-3 hover:bg-gray-700 cursor-pointer"
        @click="selectTool('selection')"
        :class="{
          'bg-gray-700': toolPanelStore.currentTool === 'selection',
        }"
      >
        <PhSelectionPlus :size="18" />
      </div>
      <div
        class="p-3 hover:bg-gray-700 cursor-pointer"
        @click="selectTool('draw-mask')"
        :class="{
          'bg-gray-700': toolPanelStore.currentTool === 'draw-mask',
        }"
      >
        <PhSubtract :size="18" />
      </div>
      <div
        class="p-3 hover:bg-gray-700 cursor-pointer"
        @click="selectTool('sketch')"
        :class="{
          'bg-gray-700': toolPanelStore.currentTool === 'sketch',
        }"
      >
        <PhPaintBrush :size="18" />
      </div>
      <div
        class="p-3 hover:bg-gray-700 cursor-pointer"
        @click="selectTool('eraser')"
        :class="{
          'bg-gray-700': toolPanelStore.currentTool === 'eraser',
        }"
      >
        <PhEraser :size="18" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapStores } from "pinia";
import { useToolPanelStore } from "@/stores/ToolPanel";

import {
  PhHandGrabbing,
  PhPaintBrush,
  PhEraser,
  PhSubtract,
  PhSelectionPlus
} from "@phosphor-icons/vue";

export default {
  components: {
    PhHandGrabbing,
    PhPaintBrush,
    PhEraser,
    PhSubtract,
    PhSelectionPlus
  },
  methods: {
    ...mapActions(useToolPanelStore, ['changeSelectedTool']),
    selectTool(tool: string) {
      this.changeSelectedTool(tool)
    },
  },
  computed: {
    ...mapStores(useToolPanelStore),
    getCurrentTool(): string {
        return this.toolPanelStore.currentTool
    }
  },
};
</script>

<style lang="less" scoped>
.__tool-panel-section {
  position: absolute;
  left: 30px;
  top: 50%;
  z-index: 10;
  background-color: #000;
  transform: translate(0, -50%);
}
</style>
