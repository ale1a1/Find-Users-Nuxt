import { defineStore } from "pinia";

export const useLoginRedirectStore = defineStore("loginRedirect", {
  state: () => ({
    redirectFrom: null as null | string, 
  }),

  actions: {
    setRedirectFrom(page: string | null) { 
      this.redirectFrom = page || null;
    },
  },
});