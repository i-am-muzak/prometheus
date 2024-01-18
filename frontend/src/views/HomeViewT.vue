<template>
  <div>
    <canvas
      ref="baseCanvas"
      @mousedown="baseCanvasMouseDown"
      @mouseup="baseCanvasMouseUp"
      @mousemove="baseCanvasMouseMove"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useToolPanelStore } from "@/stores/ToolPanel";

export default {
    data() {
        return {
            baseCanvas: null as HTMLCanvasElement | null,
            maskCanvas: null as HTMLCanvasElement | null,
            baseContext: null as CanvasRenderingContext2D | null,
            maskContext: null as CanvasRenderingContext2D | null,
            isDrawing: false as boolean,
            latestMousePositions: {
                x: 0,
                y: 0,
            },
            baseImage: new Image() as HTMLImageElement,
            viewportTopLeft: { x: 0, y: 0 },
            mousePos: { x: 0, y: 0 },
            circleGridOffset: 50,
            scale: 1,
            isGrabbing: false,
            currentOffset: { x: 0, y: 0 },
            zoomSensitivty: 500,
            minZoom: 0.5,
            maxZoom: 2,
            globalAlphaValue: 0.2,
        }
    },
    methods: {
        baseCanvasMouseDown() {
            if(!this.isDrawing) this.isDrawing = true;
        },
        baseCanvasMouseUp() {
            if(this.isDrawing) this.isDrawing = false;
        },
        baseCanvasMouseMove() {

        }
    },
    computed: {
    ...mapStores(useToolPanelStore),
    computedBaseCanvas(): HTMLCanvasElement {
      return this.$refs.baseCanvas as HTMLCanvasElement;
    },
    computedMaskCanvas(): HTMLCanvasElement {
      return this.$refs.maskCanvas as HTMLCanvasElement;
    },
    computedStartX() {
      return (
        Math.floor(this.viewportTopLeft.x / this.circleGridOffset) *
          this.circleGridOffset +
        this.circleGridOffset / 2
      );
    },

    computedFinishX() {
      return (
        this.computedStartX +
        window.innerWidth / this.scale +
        this.circleGridOffset * 5
      );
    },

    computedStartY() {
      return (
        Math.floor(this.viewportTopLeft.y / this.circleGridOffset) *
          this.circleGridOffset +
        this.circleGridOffset / 2
      );
    },

    computedFinishY() {
      return (
        this.computedStartY +
        window.innerHeight / this.scale +
        this.circleGridOffset * 5
      );
    },
  },
}
</script>

<style lang="scss" scoped></style>
