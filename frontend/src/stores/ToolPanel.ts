import { defineStore } from "pinia";

export const useToolPanelStore = defineStore("toolPanel", {
  state: () => ({
    tool: "free-pan" as string,
  }),

  getters: {
    currentTool(state) {
      return state.tool;
    },
  },
  actions: {
    changeSelectedTool(payload: string) {
      this.tool = payload;
    },
  },
});
