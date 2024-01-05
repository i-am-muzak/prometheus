<template>
  <div>
    <canvas
      @mousedown="baseCanvasMouseDown"
      @mouseup="baseCanvasMouseUp"
      @mousemove="baseCanvasMouseMove"
      @mousewheel="baseCanvasTouchStart"
      ref="baseCanvas"
    ></canvas>
    <canvas style="display: none" ref="maskCanvas"></canvas>
  </div>
</template>

<script lang="ts">
type Point = {
  x: number;
  y: number;
};
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
      tool: "free-pan",
      isGrabbing: false,
      currentOffset: { x: 0, y: 0 },
    };
  },
  computed: {
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
  mounted() {
    if (this.computedBaseCanvas) {
      this.baseCanvas = this.computedBaseCanvas;
      this.baseCanvas.width = window.innerWidth;
      this.baseCanvas.height = window.innerHeight;

      this.baseContext = this.baseCanvas.getContext("2d");
    }

    if (this.computedMaskCanvas) {
      this.maskCanvas = this.computedMaskCanvas;
      this.maskCanvas.width = window.innerWidth;
      this.maskCanvas.height = window.innerHeight;

      this.maskContext = this.maskCanvas.getContext("2d");
    }

    this.baseImage.src =
      "https://static.fuups.ai/public-model-gallery/fuups.ai-8a21ba51-7aef-4b38-9197-1d98a2375216-1702062785338-square.png";
    this.baseImage.onload = () => {
      this.drawBaseImage();
    };

    this.drawGridCircles();
  },
  methods: {
    baseCanvasTouchStart(event: WheelEvent) {
      if (this.baseContext) {
        const delta = {
          x: -event.deltaX,
          y: -event.deltaY,
        };
        this.currentOffset = this.addPoints(this.currentOffset, delta);
      }
    },
    drawMaskMouseDown(event: MouseEvent) {
      // If left click only
      if (event.button === 0) {
        this.isDrawing = true;
        if (this.maskContext) {
          this.setGlobalAlpha(1);
          this.clearBaseCanvas();
          this.drawGridCircles();
          this.drawBaseImage();

          if (!this.latestMousePositions.x && !this.latestMousePositions.y) {
            this.latestMousePositions = {
              x: event.offsetX,
              y: event.offsetY,
            };
          }

          this.maskContext.beginPath();
          this.maskContext.lineWidth = 60;
          this.maskContext.lineCap = "round";
          this.maskContext.lineJoin = "round";
          this.maskContext.strokeStyle = "rgba(0, 255, 0)";
          this.maskContext.lineTo(event.offsetX, event.offsetY);
          this.maskContext.stroke();

          this.latestMousePositions = {
            x: event.offsetX,
            y: event.offsetY,
          };
        }

        if (this.baseContext && this.maskCanvas) {
          this.baseContext.globalAlpha = 0.2;
          this.baseContext.drawImage(this.maskCanvas, 0, 0);
        }
      }
    },
    drawMaskMouseMove(event: MouseEvent) {
      if (this.isDrawing) {
        if (this.maskContext) {
          this.setGlobalAlpha(1);
          this.clearBaseCanvas();
          this.drawGridCircles();
          this.drawBaseImage();

          this.maskContext.beginPath();
          this.maskContext.lineWidth = 60;
          this.maskContext.lineCap = "round";
          this.maskContext.lineJoin = "round";
          this.maskContext.strokeStyle = "rgba(0, 255, 0)";
          this.maskContext.globalCompositeOperation = "source-over";
          this.maskContext.moveTo(event.offsetX, event.offsetY);
          this.maskContext.lineTo(event.offsetX, event.offsetY);
          this.maskContext.stroke();

          this.latestMousePositions = {
            x: event.offsetX,
            y: event.offsetY,
          };
        }

        if (this.baseContext && this.maskCanvas) {
          this.baseContext.globalAlpha = 0.2;
          this.baseContext.drawImage(this.maskCanvas, 0, 0);
        }
      }
    },
    drawMaskMouseUp(event: MouseEvent) {
      if (this.isDrawing) {
        this.isDrawing = false;
      }
    },
    freePanMouseDown(event: MouseEvent) {
      if (event.button === 0) {
        if (!this.isGrabbing) {
          this.latestMousePositions = {
            x: event.pageX,
            y: event.pageY,
          };

          this.isGrabbing = true;
        }
      }
    },
    freePanMouseMove(event: MouseEvent) {
      if (this.baseContext && this.isGrabbing) {
        const lastMousePos = this.latestMousePositions;
        const currentMousePos = { x: event.pageX, y: event.pageY };
        this.latestMousePositions = currentMousePos;

        const mouseDiff = this.diffPoints(currentMousePos, lastMousePos);
        const scaledMouseDiff = this.scalePoint(mouseDiff, this.scale);
        this.currentOffset = this.addPoints(
          this.currentOffset,
          scaledMouseDiff
        );
      }
    },
    freePanMouseUp(event: MouseEvent) {
      if (this.isGrabbing) {
        this.isGrabbing = false;
      }
    },
    setGlobalAlpha(value: number) {
      if (this.baseContext) {
        this.baseContext.globalAlpha = value;
      }
    },
    drawBaseImage() {
      if (this.baseContext) {
        this.baseContext.drawImage(
          this.baseImage,
          (window.innerWidth - this.baseImage.width) / 2,
          (window.innerHeight - this.baseImage.height) / 2
        );
      }
    },
    clearBaseCanvas() {
      if (this.baseContext) {
        this.baseContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    },
    clearMaskCanvas() {
      if (this.maskContext) {
        this.maskContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    },
    baseCanvasMouseDown(event: MouseEvent) {
      switch (this.tool) {
        case "draw-mask":
          this.drawMaskMouseDown(event);
          break;

        case "free-pan":
          this.freePanMouseDown(event);
          break;

        default:
          break;
      }
    },
    baseCanvasMouseUp(event: MouseEvent) {
      switch (this.tool) {
        case "draw-mask":
          this.drawMaskMouseUp(event);
          break;
        case "free-pan":
          this.freePanMouseUp(event);
        default:
          break;
      }
    },
    baseCanvasMouseMove(event: MouseEvent) {
      switch (this.tool) {
        case "draw-mask":
          this.drawMaskMouseMove(event);
          break;

        case "free-pan":
          this.freePanMouseMove(event);
          break;
        default:
          break;
      }
    },
    diffPoints(p1: Point, p2: Point) {
      return { x: p1.x - p2.x, y: p1.y - p2.y };
    },
    addPoints(p1: Point, p2: Point) {
      return { x: p1.x + p2.x, y: p1.y + p2.y };
    },
    scalePoint(p1: Point, scale: number) {
      return { x: p1.x / scale, y: p1.y / scale };
    },
    updateTransform() {
      if (this.baseContext) {
        const storedTransform = this.baseContext.getTransform();
        this.baseContext.canvas.width = this.baseContext.canvas.width;
        this.baseContext.setTransform(storedTransform);
      }
    },
    drawGridCircles() {
      if (this.baseContext) {
        this.baseContext.beginPath();
        for (
          let x = this.computedStartX;
          x < this.computedFinishX;
          x += this.circleGridOffset
        ) {
          for (
            let y = this.computedStartY;
            y < this.computedFinishY;
            y += this.circleGridOffset
          ) {
            this.baseContext.moveTo(x, y);
            this.baseContext.arc(x, y, 2, 0, 2 * Math.PI);
          }
        }
        this.baseContext.fillStyle = "#333";
        this.baseContext.fill();
      }
    },
    updateMousePos(x: number, y: number) {
      if (this.baseCanvas) {
        const viewportMousePos = { x: x, y: y };
        const topLeftCanvasPos = {
          x: this.baseCanvas.offsetLeft,
          y: this.baseCanvas.offsetTop,
        };

        this.mousePos = this.diffPoints(viewportMousePos, topLeftCanvasPos);
      }
    },
  },
  watch: {
    currentOffset: {
      handler(newValue, oldValue) {
        if (this.baseContext) {
          const offsetDiff = this.scalePoint(
            this.diffPoints(newValue, oldValue),
            1
          );

          this.baseContext.translate(offsetDiff.x, offsetDiff.y);
          this.viewportTopLeft = this.diffPoints(
            this.viewportTopLeft,
            offsetDiff
          );

          this.updateTransform();
          this.drawGridCircles();
          this.drawBaseImage();
        }
      },
      deep: true,
    },
  },
};
</script>
