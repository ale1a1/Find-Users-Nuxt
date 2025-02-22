import { defineStore } from 'pinia';

type Token = string | null;

export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: null as string | null,
    // TODO: assign type to user
    currentUser: null as any | null,
  }),
  actions: {
    setToken(token: Token) {
      this.token = token;
      if (token) sessionStorage.setItem('find-users-Token', token);      
    },
    clearToken() {
      this.token = null;
      sessionStorage.removeItem('find-users-Token'); 
    },
    setCurrentUser(user: any) {
      this.currentUser = user;
    },
    clearCurrentUser() {
      this.currentUser = null;
    },
  },
});