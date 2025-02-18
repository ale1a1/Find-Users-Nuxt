import { defineStore } from 'pinia';
import type { FirebaseUser } from '~/types/firebase';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | FirebaseUser
  }),

  actions: {
    setUser(user: FirebaseUser) {
      this.user = user;
    },

    logout() {
      this.user = null;
    },
  },
});