<template>
  <div>
    <div
      class="editorCursor"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
type Position = {
  x: number;
  y: number;
};
interface Props {
  position: Position;
}
import { defineProps} from "vue";
const props = defineProps<Props>();
</script>

<style lang="less" scoped>
.editorCursor {
  position: absolute;
  z-index: 9;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgb(26, 26, 26);
  border-style: dashed;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
