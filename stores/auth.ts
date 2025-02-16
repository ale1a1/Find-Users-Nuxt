import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: string; name: string; email: string }, 
  }),

  actions: {
    setUser(user: { id: string; name: string; email: string }) {
      this.user = user;
    },

    logout() {
      this.user = null;
    },
  },
});